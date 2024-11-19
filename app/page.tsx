"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save, Trash } from "lucide-react";
import { VoiceRecorder } from "./components/VoiceRecorder";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  useEffect(() => {
    const loadedNotes = localStorage.getItem("savedNotes");
    if (loadedNotes) {
      setSavedNotes(JSON.parse(loadedNotes));
    }
  }, []);

  useEffect(() => {
    const words = text.trim().split(/\s+/);
    setWordCount(text.trim() === "" ? 0 : words.length);
  }, [text]);

  const handleTranscript = (transcript: string) => {
    setText((prev) => prev + " " + transcript);
  };

  const saveNote = () => {
    if (text.trim()) {
      const newNotes = [...savedNotes, text];
      setSavedNotes(newNotes);
      localStorage.setItem("savedNotes", JSON.stringify(newNotes));
      setText("");
    }
  };

  const clearText = () => {
    setText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Voice Notes & Essay Writer
          </h1>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <VoiceRecorder onTranscript={handleTranscript} />
              
              <Button
                onClick={saveNote}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Note
              </Button>
              
              <Button
                onClick={clearText}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Trash className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or speaking..."
              className="min-h-[200px] text-lg p-4"
            />

            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
              <span>Word Count: {wordCount}</span>
            </div>
          </div>
        </Card>

        {savedNotes.length > 0 && (
          <Card className="p-6 bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Saved Notes</h2>
            <div className="space-y-4">
              {savedNotes.map((note, index) => (
                <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-700">
                  <p className="text-gray-800 dark:text-gray-200">{note}</p>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  );
}