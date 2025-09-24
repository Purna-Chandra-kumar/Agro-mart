import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Truck, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    productName?: string;
    productPrice?: number;
    deliveryFee?: number;
    totalAmount: number;
    service_type: string;
    product_id?: string;
    delivery_partner_id?: string;
    metadata?: any;
    items?: Array<{
      product_name: string;
      quantity: number;
      unit: string;
      price: number;
      delivery_partner: string;
      delivery_fee: number;
    }>;
    total_amount?: number;
    delivery_fees?: number;
  };
  onPaymentSuccess: (transaction: any) => void;
  onPaymentFailure: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  orderDetails, 
  onPaymentSuccess, 
  onPaymentFailure 
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        toast({
          title: "Payment Gateway Error",
          description: "Failed to load payment gateway. Please try again.",
          variant: "destructive"
        });
      };
      document.head.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }

    return () => {
      // Cleanup script if needed
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast({
        title: "Payment Gateway Loading",
        description: "Please wait for payment gateway to load.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Create order via edge function
      const { data, error } = await supabase.functions.invoke('razorpay-payment', {
        body: {
          action: 'create_order',
          amount: orderDetails.totalAmount,
          service_type: orderDetails.service_type,
          product_id: orderDetails.product_id,
          delivery_partner_id: orderDetails.delivery_partner_id,
          metadata: orderDetails.metadata,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const { order_id, amount, currency, key_id, transaction_id } = data;

      // Configure Razorpay options
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'AgroMart',
        description: `Payment for ${orderDetails.productName}`,
        order_id: order_id,
        prefill: {
          method: 'upi',
        },
        theme: {
          color: '#16a34a'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setPaymentStatus('idle');
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled by user.",
              variant: "destructive"
            });
          }
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('razorpay-payment', {
              body: {
                action: 'verify_payment',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                transaction_id: transaction_id,
              },
            });

            if (verifyError || !verifyData.success) {
              throw new Error('Payment verification failed');
            }

            setPaymentStatus('success');
            toast({
              title: "Payment Successful!",
              description: `Payment of ₹${orderDetails.totalAmount} completed successfully.`,
              className: "bg-green-50 border-green-200"
            });

            onPaymentSuccess(verifyData.transaction);
            onClose();

          } catch (error: any) {
            setPaymentStatus('failed');
            toast({
              title: "Payment Verification Failed",
              description: error.message,
              variant: "destructive"
            });
            onPaymentFailure(error.message);
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      setIsProcessing(false);
      setPaymentStatus('failed');
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive"
      });
      onPaymentFailure(error.message);
    }
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
    handlePayment();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Secure Payment</span>
          </DialogTitle>
          <DialogDescription>
            Complete your payment securely with UPI or cards
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {orderDetails.items ? (
                // Bulk order from cart
                <>
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{item.product_name} ({item.quantity} {item.unit})</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="ml-4">via {item.delivery_partner}</span>
                        <span>+₹{item.delivery_fee}</span>
                      </div>
                    </div>
                  ))}
                  <hr />
                  <div className="flex justify-between">
                    <span>Total Delivery Fees</span>
                    <span>₹{orderDetails.delivery_fees || 0}</span>
                  </div>
                </>
              ) : (
                // Single item order
                <>
                  <div className="flex justify-between">
                    <span>{orderDetails.productName}</span>
                    <span>₹{orderDetails.productPrice}</span>
                  </div>
                  {orderDetails.deliveryFee && orderDetails.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        Delivery Fee
                      </span>
                      <span>₹{orderDetails.deliveryFee}</span>
                    </div>
                  )}
                </>
              )}
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-green-600">₹{orderDetails.totalAmount || orderDetails.total_amount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Test UPI Info */}
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Smartphone className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Test Mode - Use these UPI IDs:</span>
                  </div>
                  <div className="space-y-1 text-sm text-yellow-700">
                    <div>• <strong>test@upi</strong> - General test UPI</div>
                    <div>• <strong>success@razorpay</strong> - Simulate success</div>
                    <div>• <strong>failure@razorpay</strong> - Simulate failure</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">UPI Payment</div>
                      <div className="text-sm text-gray-600">Google Pay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Recommended
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 text-center">
                  Also supports Debit/Credit Cards and Net Banking
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          {paymentStatus === 'processing' && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span>Processing payment...</span>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <span className="text-green-800">Payment successful!</span>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <span className="text-red-800">Payment failed. Please retry.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {paymentStatus === 'idle' && (
              <Button 
                onClick={handlePayment}
                disabled={isProcessing || !razorpayLoaded}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Pay ₹{orderDetails.totalAmount || orderDetails.total_amount} Securely
              </Button>
            )}

            {paymentStatus === 'failed' && (
              <Button 
                onClick={handleRetry}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Retry Payment
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
              disabled={isProcessing}
            >
              {paymentStatus === 'processing' ? 'Please wait...' : 'Cancel'}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center">
            🔒 Your payment is secured with 256-bit SSL encryption
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;