import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  language?: string;
}

export default function VoiceInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  maxLength,
  className,
  language = 'en-US'
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const getLanguageCode = () => {
    switch (language) {
      case 'hi': return 'hi-IN';
      case 'te': return 'te-IN';
      case 'en': return 'en-US';
      default: return 'en-US';
    }
  };

  const startVoiceInput = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try browser speech recognition first
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = getLanguageCode();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
          setIsListening(true);
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onChange(transcript);
          setIsListening(false);
          toast({
            title: 'Voice input received',
            description: 'Speech converted to text successfully',
          });
        };
        
        recognition.onerror = () => {
          setIsListening(false);
          // Fallback to Whisper API
          startRecording(stream);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        // Fallback to recording for Whisper API
        startRecording(stream);
      }
    } catch (error) {
      toast({
        title: 'Microphone access denied',
        description: 'Please allow microphone access and try again',
        variant: 'destructive',
      });
    }
  };

  const startRecording = (stream: MediaStream) => {
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      await transcribeWithWhisper(audioBlob);
      stream.getTracks().forEach(track => track.stop());
    };

    setIsListening(true);
    mediaRecorder.start();

    // Stop recording after 5 seconds
    setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }, 5000);
  };

  const transcribeWithWhisper = async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);
      setIsListening(false);

      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('whisper-transcribe', {
          body: { audio: base64Audio }
        });

        if (error) throw error;

        if (data?.text) {
          onChange(data.text);
          toast({
            title: 'Voice input received',
            description: 'Speech converted to text successfully',
          });
        }
      };
    } catch (error) {
      toast({
        title: 'Voice input failed',
        description: 'Could not process speech. Please try typing instead.',
        variant: 'destructive',
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={className}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={isListening ? stopRecording : startVoiceInput}
          disabled={isTranscribing}
          className="shrink-0"
        >
          {isTranscribing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isListening ? (
            <MicOff className="h-4 w-4 text-red-500" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isListening && (
        <p className="text-xs text-blue-600">
          Listening... Speak clearly in your selected language
        </p>
      )}
      {isTranscribing && (
        <p className="text-xs text-orange-600">
          Processing speech...
        </p>
      )}
    </div>
  );
}