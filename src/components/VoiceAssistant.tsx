import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Volume2, VolumeX, User, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAadhaarAuth } from '@/hooks/useAadhaarAuth';
import '../types/speech.d.ts';

interface VoiceAssistantProps {
  onAuthSuccess?: (data: any) => void;
  onClose?: () => void;
}

interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const languages = {
  en: { code: 'en-US', name: 'English', flag: '🇺🇸' },
  hi: { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
  te: { code: 'te-IN', name: 'తెలుగు', flag: '🇮🇳' }
};

export default function VoiceAssistant({ onAuthSuccess, onClose }: VoiceAssistantProps) {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [collectedData, setCollectedData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState<'welcome' | 'signup' | 'login' | 'collecting'>('welcome');

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { handleSignup, handleLogin, isLoading } = useAadhaarAuth();

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = languages[selectedLanguage as keyof typeof languages].code;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
        setIsListening(false);
        processUserMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: 'Speech Recognition Error',
          description: 'Could not understand speech. Please try again.',
          variant: 'destructive',
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Welcome message
    initializeConversation();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = languages[selectedLanguage as keyof typeof languages].code;
    }
  }, [selectedLanguage]);

  const initializeConversation = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: {
          action: 'welcome',
          language: selectedLanguage
        }
      });

      if (error) throw error;

      setConversationHistory(data.conversationHistory || []);
      speakMessage(data.response);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to voice assistant.',
        variant: 'destructive',
      });
    }
  };

  const processUserMessage = async (message: string) => {
    setIsProcessing(true);

    try {
      // Check if user is indicating signup or login intent
      const lowerMessage = message.toLowerCase();
      if (currentStep === 'welcome') {
        if (lowerMessage.includes('sign up') || lowerMessage.includes('register') || lowerMessage.includes('new')) {
          setCurrentStep('signup');
        } else if (lowerMessage.includes('log in') || lowerMessage.includes('login') || lowerMessage.includes('existing')) {
          setCurrentStep('login');
        }
      }

      // Extract information based on current step
      if (currentStep === 'signup') {
        extractSignupData(message);
      } else if (currentStep === 'login') {
        extractLoginData(message);
      }

      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: {
          message,
          language: selectedLanguage,
          conversationHistory
        }
      });

      if (error) throw error;

      setConversationHistory(data.conversationHistory || []);
      speakMessage(data.response);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = selectedLanguage === 'hi' 
        ? 'माफ करें, मुझे समस्या हो रही है। कृपया दोबारा कोशिश करें।'
        : selectedLanguage === 'te'
        ? 'క్షమించండి, నాకు సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి.'
        : 'Sorry, I\'m having trouble. Please try again.';
      
      speakMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const extractSignupData = (message: string) => {
    const data = { ...collectedData };
    
    // Extract Aadhaar number (12 digits)
    const aadhaarMatch = message.match(/\b\d{12}\b/);
    if (aadhaarMatch) {
      data.aadhaarNumber = aadhaarMatch[0];
    }

    // Extract phone number (10 digits)
    const phoneMatch = message.match(/\b\d{10}\b/);
    if (phoneMatch) {
      data.phoneNumber = phoneMatch[0];
    }

    // If no numbers, assume it's name or village/crop
    if (!aadhaarMatch && !phoneMatch) {
      if (!data.name) {
        data.name = message.trim();
      } else if (!data.village) {
        data.village = message.trim();
      } else if (!data.cropType) {
        data.cropType = message.trim();
      }
    }

    setCollectedData(data);

    // Check if we have all required data for signup
    if (data.name && data.aadhaarNumber && data.phoneNumber) {
      handleVoiceSignup(data);
    }
  };

  const extractLoginData = (message: string) => {
    const phoneMatch = message.match(/\b\d{10}\b/);
    if (phoneMatch) {
      handleVoiceLogin({ phoneNumber: phoneMatch[0] });
    }
  };

  const handleVoiceSignup = async (data: any) => {
    try {
      await handleSignup({
        name: data.name,
        aadhaarNumber: data.aadhaarNumber,
        phoneNumber: data.phoneNumber,
        dateOfBirth: '1990-01-01' // Default DOB, can be enhanced
      });
      
      if (onAuthSuccess) {
        onAuthSuccess(data);
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleVoiceLogin = async (data: any) => {
    try {
      await handleLogin({
        aadhaarNumber: '', // Will be looked up by phone
        phoneNumber: data.phoneNumber
      });
      
      if (onAuthSuccess) {
        onAuthSuccess(data);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const speakMessage = (message: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = languages[selectedLanguage as keyof typeof languages].code;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Speech Recognition Not Supported',
        description: 'Your browser does not support speech recognition.',
        variant: 'destructive',
      });
      return;
    }

    if (isSpeaking) {
      synthRef.current?.cancel();
      setIsSpeaking(false);
    }

    setIsListening(true);
    setCurrentMessage('');
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">AgroMart Assistant</h3>
              <p className="text-xs text-green-600">Voice Helper</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {showSettings && (
          <div className="mb-4 p-3 bg-white/50 rounded-lg">
            <label className="text-sm font-medium text-green-700 mb-2 block">
              Language / भाषा / భాష
            </label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([code, lang]) => (
                  <SelectItem key={code} value={code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-4">
          {conversationHistory.slice(-3).map((msg, index) => (
            <div key={index} className={`p-3 rounded-lg ${
              msg.role === 'assistant' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800 ml-4'
            }`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}

          {currentMessage && (
            <div className="p-3 rounded-lg bg-blue-100 text-blue-800 ml-4">
              <p className="text-sm">{currentMessage}</p>
            </div>
          )}

          {isProcessing && (
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-800">
              <p className="text-sm">Processing...</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center space-x-4 mt-6">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            className={`w-16 h-16 rounded-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </Button>

          <Button
            onClick={isSpeaking ? stopSpeaking : () => speakMessage('Hello')}
            variant="outline"
            className="w-12 h-12 rounded-full"
            disabled={isProcessing}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-green-600">
            {isListening 
              ? (selectedLanguage === 'hi' ? 'सुन रहा हूं...' : 
                 selectedLanguage === 'te' ? 'వింటున్నాను...' : 'Listening...') 
              : (selectedLanguage === 'hi' ? 'बोलने के लिए माइक दबाएं' : 
                 selectedLanguage === 'te' ? 'మాట్లాడటానికి మైక్ నొక్కండి' : 'Tap mic to speak')}
          </p>
        </div>

        {onClose && (
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full mt-4 text-green-600"
          >
            Close Assistant
          </Button>
        )}
      </CardContent>
    </Card>
  );
}