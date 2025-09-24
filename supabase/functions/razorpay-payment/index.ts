import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number;
  service_type: string;
  product_id?: string;
  delivery_partner_id?: string;
  metadata?: any;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    if (req.method === 'POST') {
      const { action, ...requestData } = await req.json();

      if (action === 'create_order') {
        return await createOrder(requestData, user.id, supabaseClient);
      } else if (action === 'verify_payment') {
        return await verifyPayment(requestData, user.id, supabaseClient);
      } else {
        throw new Error('Invalid action');
      }
    }

    throw new Error('Method not allowed');

  } catch (error: any) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

async function createOrder(
  requestData: PaymentRequest,
  userId: string,
  supabaseClient: any
): Promise<Response> {
  const { amount, service_type, product_id, delivery_partner_id, metadata } = requestData;

  // Create Razorpay order
  const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
  const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  const orderData = {
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt: `${service_type}_${Date.now()}`,
    payment_capture: true,
  };

  const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
  
  const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!razorpayResponse.ok) {
    const errorText = await razorpayResponse.text();
    throw new Error(`Razorpay order creation failed: ${errorText}`);
  }

  const razorpayOrder: RazorpayOrder = await razorpayResponse.json();

  // Store transaction in database
  const { data: transaction, error: dbError } = await supabaseClient
    .from('transactions')
    .insert({
      user_id: userId,
      transaction_id: razorpayOrder.id,
      payment_method: 'upi',
      amount: amount,
      currency: 'INR',
      status: 'pending',
      service_type: service_type,
      product_id: product_id,
      delivery_partner_id: delivery_partner_id,
      payment_gateway: 'razorpay',
      gateway_order_id: razorpayOrder.id,
      metadata: metadata,
    })
    .select()
    .single();

  if (dbError) {
    console.error('Database error:', dbError);
    throw new Error('Failed to store transaction');
  }

  return new Response(
    JSON.stringify({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: razorpayKeyId,
      transaction_id: transaction.id,
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function verifyPayment(
  requestData: any,
  userId: string,
  supabaseClient: any
): Promise<Response> {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transaction_id } = requestData;

  // Verify signature
  const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
  if (!razorpayKeySecret) {
    throw new Error('Razorpay secret not configured');
  }

  const expectedSignature = await generateSignature(
    razorpay_order_id + '|' + razorpay_payment_id,
    razorpayKeySecret
  );

  const isSignatureValid = expectedSignature === razorpay_signature;

  // Update transaction status
  const { data: transaction, error: updateError } = await supabaseClient
    .from('transactions')
    .update({
      status: isSignatureValid ? 'completed' : 'failed',
      gateway_payment_id: razorpay_payment_id,
      gateway_signature: razorpay_signature,
      updated_at: new Date().toISOString(),
    })
    .eq('id', transaction_id)
    .eq('user_id', userId)
    .select()
    .single();

  if (updateError) {
    console.error('Transaction update error:', updateError);
    throw new Error('Failed to update transaction');
  }

  return new Response(
    JSON.stringify({
      success: isSignatureValid,
      transaction: transaction,
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function generateSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataToSign = encoder.encode(data);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, dataToSign);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(handler);