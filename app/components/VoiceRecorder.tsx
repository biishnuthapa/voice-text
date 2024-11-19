"use client";

import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition({
    onResult: (transcript) => {
      onTranscript(transcript);
    },
    onError: (error) => {
      toast.error(error === 'network' ? 
        'Network error. Please check your internet connection.' : 
        `Error: ${error}. Please try again.`
      );
    },
  });

  if (!isSupported) {
    return (
      <Button variant="destructive" disabled className="w-full sm:w-auto">
        <MicOff className="mr-2 h-4 w-4" />
        Browser Not Supported
      </Button>
    );
  }

  return (
    <Button
      onClick={isListening ? stopListening : startListening}
      variant={isListening ? "destructive" : "default"}
      className="w-full sm:w-auto"
    >
      {isListening ? (
        <>
          <MicOff className="mr-2 h-4 w-4" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="mr-2 h-4 w-4" />
          Start Recording
        </>
      )}
    </Button>
  );
}