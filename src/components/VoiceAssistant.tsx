import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mic, MicOff, Volume2, VolumeX, User, Settings, RefreshCw, Keyboard, AlertCircle } from 'lucide-react';
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
  en: { code: 'en-US', name: 'English', flag: '🇺🇸', whisperCode: 'en' },
  hi: { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳', whisperCode: 'hi' },
  te: { code: 'te-IN', name: 'తెలుగు', flag: '🇮🇳', whisperCode: 'te' }
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
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const [speechErrors, setSpeechErrors] = useState(0);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualText, setManualText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { handleSignup, handleLogin, isLoading } = useAadhaarAuth();

  useEffect(() => {
    checkMicrophonePermission();
    initializeSpeechSynthesis();
    initializeSpeechRecognition();
    initializeConversation();

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = languages[selectedLanguage as keyof typeof languages].code;
    }
  }, [selectedLanguage]);

  const checkMicrophonePermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicPermission('denied');
        return;
      }

      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setMicPermission(result.state as any);
      
      result.onchange = () => {
        setMicPermission(result.state as any);
      };
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      setMicPermission('prompt');
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
      setSpeechErrors(0);
      toast({
        title: 'Microphone Access Granted',
        description: 'You can now use voice commands.',
      });
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setMicPermission('denied');
      toast({
        title: 'Microphone Access Denied',
        description: 'Please enable microphone access to use voice features.',
        variant: 'destructive',
      });
    }
  };

  const initializeSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = languages[selectedLanguage as keyof typeof languages].code;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        console.log('Speech recognition result:', transcript, 'Confidence:', confidence);
        
        setCurrentMessage(transcript);
        setIsListening(false);
        setSpeechErrors(0);
        processUserMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        handleSpeechError(event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const handleSpeechError = (error: string) => {
    setSpeechErrors(prev => prev + 1);
    
    const errorMessages = {
      en: {
        'no-speech': 'No speech detected. Please speak clearly and try again.',
        'audio-capture': 'Microphone not working. Please check your microphone.',
        'not-allowed': 'Microphone access denied. Please enable microphone access.',
        'network': 'Network error. Please check your internet connection.',
        'aborted': 'Speech recognition was cancelled.',
        'default': 'Speech recognition failed. Please speak clearly and try again.'
      },
      hi: {
        'no-speech': 'कोई आवाज़ नहीं सुनाई दी। कृपया स्पष्ट रूप से बोलें और फिर से कोशिश करें।',
        'audio-capture': 'माइक्रोफोन काम नहीं कर रहा। कृपया अपना माइक्रोफोन जांचें।',
        'not-allowed': 'माइक्रोफोन की अनुमति नहीं दी गई। कृपया माइक्रोफोन एक्सेस चालू करें।',
        'network': 'नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।',
        'aborted': 'वॉयस रिकग्निशन रद्द हो गया।',
        'default': 'वॉयस रिकग्निशन असफल। कृपया स्पष्ट रूप से बोलें और दोबारा कोशिश करें।'
      },
      te: {
        'no-speech': 'మాట వినిపించలేదు. దయచేసి స్పష్టంగా మాట్లాడి మళ్లీ ప్రయత్నించండి.',
        'audio-capture': 'మైక్రోఫోన్ పని చేయడం లేదు. దయచేసి మీ మైక్రోఫోన్ చెక్ చేయండి.',
        'not-allowed': 'మైక్రోఫోన్ అనుమతి లేదు. దయచేసి మైక్రోఫోన్ యాక్సెస్ ఎనేబుల్ చేయండి.',
        'network': 'నెట్‌వర్క్ లోపం. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్ చెక్ చేయండి.',
        'aborted': 'వాయిస్ రికగ్నిషన్ రద్దు చేయబడింది.',
        'default': 'వాయిస్ రికగ్నిషన్ విఫలమైంది. దయచేసి స్పష్టంగా మాట్లాడి మళ్లీ ప్రయత్నించండి.'
      }
    };

    const langMessages = errorMessages[selectedLanguage as keyof typeof errorMessages] || errorMessages.en;
    const message = langMessages[error as keyof typeof langMessages] || langMessages.default;

    toast({
      title: 'Speech Recognition Error',
      description: message,
      variant: 'destructive',
    });

    // Show manual input option after 2 failed attempts
    if (speechErrors >= 1) {
      setShowManualInput(true);
    }

    // Try Whisper API after 3 failed attempts
    if (speechErrors >= 2) {
      speakMessage(selectedLanguage === 'hi' 
        ? 'मैं दूसरे तरीके से कोशिश कर रहा हूं। कृपया बोलें।'
        : selectedLanguage === 'te'
        ? 'నేను వేరే మార్గంలో ప్రయత్నిస్తున్నాను. దయచేసి మాట్లాడండి.'
        : 'Let me try a different way. Please speak.');
      
      startWhisperRecording();
    }
  };

  const startWhisperRecording = async () => {
    try {
      if (micPermission !== 'granted') {
        await requestMicrophonePermission();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeWithWhisper(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 10000);

    } catch (error) {
      console.error('Error starting Whisper recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Could not start audio recording.',
        variant: 'destructive',
      });
    }
  };

  const transcribeWithWhisper = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const { data, error } = await supabase.functions.invoke('whisper-transcribe', {
        body: {
          audioBlob: base64Audio,
          language: languages[selectedLanguage as keyof typeof languages].whisperCode
        }
      });

      if (error) throw error;

      if (data.text) {
        setCurrentMessage(data.text);
        setSpeechErrors(0);
        processUserMessage(data.text);
        
        toast({
          title: 'Speech Recognized',
          description: 'Your speech was understood using advanced recognition.',
        });
      } else {
        throw new Error('No text transcribed');
      }

    } catch (error) {
      console.error('Whisper transcription error:', error);
      toast({
        title: 'Transcription Error',
        description: 'Could not understand speech. Please try manual input.',
        variant: 'destructive',
      });
      setShowManualInput(true);
    } finally {
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

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
      const lowerMessage = message.toLowerCase();
      if (currentStep === 'welcome') {
        if (lowerMessage.includes('sign up') || lowerMessage.includes('register') || lowerMessage.includes('new')) {
          setCurrentStep('signup');
        } else if (lowerMessage.includes('log in') || lowerMessage.includes('login') || lowerMessage.includes('existing')) {
          setCurrentStep('login');
        }
      }

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
    
    const aadhaarMatch = message.match(/\b\d{12}\b/);
    if (aadhaarMatch) {
      data.aadhaarNumber = aadhaarMatch[0];
    }

    const phoneMatch = message.match(/\b\d{10}\b/);
    if (phoneMatch) {
      data.phoneNumber = phoneMatch[0];
    }

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
        dateOfBirth: '1990-01-01'
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
        aadhaarNumber: '',
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

  const startListening = async () => {
    if (micPermission !== 'granted') {
      await requestMicrophonePermission();
      return;
    }

    if (!recognitionRef.current) {
      toast({
        title: 'Speech Recognition Not Supported',
        description: 'Your browser does not support speech recognition. Using backup method.',
        variant: 'destructive',
      });
      startWhisperRecording();
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
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    setIsRecording(false);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const handleManualSubmit = () => {
    if (manualText.trim()) {
      processUserMessage(manualText.trim());
      setManualText('');
      setShowManualInput(false);
    }
  };

  const retryListening = () => {
    setSpeechErrors(0);
    setShowManualInput(false);
    startListening();
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <>
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

          {micPermission === 'denied' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Microphone Access Required</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Please enable microphone access to use voice features.
              </p>
              <Button 
                size="sm" 
                className="mt-2 bg-red-600 hover:bg-red-700"
                onClick={requestMicrophonePermission}
              >
                Enable Microphone
              </Button>
            </div>
          )}

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

            {(isProcessing || isRecording) && (
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-800">
                <p className="text-sm">
                  {isRecording ? 'Recording...' : 'Processing...'}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center space-x-4 mt-6">
            <Button
              onClick={isListening || isRecording ? stopListening : startListening}
              disabled={isProcessing || isSpeaking || micPermission === 'denied'}
              className={`w-16 h-16 rounded-full ${
                (isListening || isRecording)
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {(isListening || isRecording) ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </Button>

            {speechErrors > 0 && (
              <Button
                onClick={retryListening}
                variant="outline"
                className="w-12 h-12 rounded-full"
                disabled={isProcessing || micPermission === 'denied'}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}

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

            {speechErrors > 1 && (
              <Button
                onClick={() => setShowManualInput(true)}
                variant="outline"
                className="w-12 h-12 rounded-full"
              >
                <Keyboard className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-green-600">
              {(isListening || isRecording)
                ? (selectedLanguage === 'hi' ? 'सुन रहा हूं...' : 
                   selectedLanguage === 'te' ? 'వింటున్నాను...' : 'Listening...') 
                : (selectedLanguage === 'hi' ? 'बोलने के लिए माइक दबाएं' : 
                   selectedLanguage === 'te' ? 'మాట్లాడటానికి మైక్ నొక్కండి' : 'Tap mic to speak')}
            </p>
            {speechErrors > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                {speechErrors === 1 ? 'Speech unclear. ' : 'Multiple attempts failed. '}
                {speechErrors > 1 && 'Try manual input or retry.'}
              </p>
            )}
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

      <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Input</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Speech recognition isn't working well. Please type your response:
            </p>
            <div>
              <Label htmlFor="manual-input">Your message</Label>
              <Input
                id="manual-input"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Type your response here..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualSubmit();
                  }
                }}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleManualSubmit} disabled={!manualText.trim()}>
                Send
              </Button>
              <Button variant="outline" onClick={retryListening}>
                Try Voice Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}