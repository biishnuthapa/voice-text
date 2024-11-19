"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
}

export const useSpeechRecognition = ({ onResult, onError }: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join('');
            onResult(transcript);
          };

          recognition.onerror = (event) => {
            onError(event.error);
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          setRecognition(recognition);
        } else {
          onError('Speech recognition is not supported in this browser');
        }
      } catch (error) {
        onError('Speech recognition is not supported in this browser');
      }
    }
  }, [onResult, onError]);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        onError('Error starting speech recognition');
        setIsListening(false);
      }
    }
  }, [recognition, onError]);

  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (error) {
        onError('Error stopping speech recognition');
      }
    }
  }, [recognition, onError]);

  return {
    isListening,
    startListening,
    stopListening,
    isSupported: !!recognition
  };
};