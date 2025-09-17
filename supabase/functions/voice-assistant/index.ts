import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const systemPrompts = {
  en: `You are a helpful AI assistant for AgroMart, helping farmers with signup and login. 
Keep responses very short and conversational. Ask one question at a time.
For signup, collect: name, aadhaar number, village/district, crop type.
For login, just ask for phone number.
Always be polite and patient.`,
  
  hi: `आप AgroMart के लिए एक सहायक AI असिस्टेंट हैं, जो किसानों की साइनअप और लॉगिन में मदद करते हैं।
जवाब बहुत छोटे और बातचीत जैसे रखें। एक समय में एक ही सवाल पूछें।
साइनअप के लिए जानकारी लें: नाम, आधार नंबर, गांव/जिला, फसल का प्रकार।
लॉगिन के लिए बस फोन नंबर पूछें।
हमेशा विनम्र और धैर्यवान रहें।`,
  
  te: `మీరు AgroMart కోసం ఒక సహాయక AI అసిస్టెంట్, రైతులకు సైన్అప్ మరియు లాగిన్‌లో సహాయం చేస్తున్నారు।
చాలా చిన్న మరియు సంభాషణాత్మక సమాధానాలు ఇవ్వండి. ఒక సమయంలో ఒక ప్రశ్న మాత్రమే అడగండి।
సైన్అప్ కోసం సేకరించండి: పేరు, ఆధార్ నంబర్, గ్రామం/జిల్లా, పంట రకం।
లాగిన్ కోసం కేవలం ఫోన్ నంబర్ అడగండి।
ఎల్లప్పుడూ మర్యాదగా మరియు ధైర్యంగా ఉండండి।`
};

const welcomeMessages = {
  en: "Hello! I'm your AgroMart assistant. Would you like to sign up as a new farmer or log in to your existing account?",
  hi: "नमस्ते! मैं आपका AgroMart असिस्टेंट हूं। क्या आप नए किसान के रूप में साइन अप करना चाहते हैं या अपने मौजूदा खाते में लॉग इन करना चाहते हैं?",
  te: "నమస్కారం! నేను మీ AgroMart అసిస్టెంట్‌ని. మీరు కొత్త రైతుగా సైన్ అప్ చేయాలనుకుంటున్నారా లేదా మీ ఉన్న ఖాతాలోకి లాగిన్ చేయాలనుకుంటున్నారా?"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = 'en', conversationHistory = [], action } = await req.json();

    if (action === 'welcome') {
      return new Response(JSON.stringify({ 
        response: welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages.en,
        conversationHistory: [{
          role: 'assistant',
          content: welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages.en
        }]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const messages: ConversationMessage[] = [
      {
        role: 'system',
        content: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: assistantResponse }
    ].slice(-10); // Keep only last 10 messages

    return new Response(JSON.stringify({
      response: assistantResponse,
      conversationHistory: updatedHistory
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in voice-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, I'm having trouble understanding. Could you please try again?"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});