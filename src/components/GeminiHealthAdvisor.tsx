
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Send, Mic, Brain } from "lucide-react";
import { askGemini, setGeminiApiKey, getGeminiApiKey } from "@/services/geminiService";
import VoiceInput from "./VoiceInput";

const GeminiHealthAdvisor = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [voiceInputOpen, setVoiceInputOpen] = useState(false);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!getGeminiApiKey()) {
      setApiKeyDialogOpen(true);
      return;
    }

    setIsLoading(true);
    setResponse("");

    try {
      const answer = await askGemini(question);
      setResponse(answer);
      toast.success("Response received from Gemini AI");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get response from Gemini AI");
      setResponse("Sorry, there was an error processing your question. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySave = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    setGeminiApiKey(apiKey);
    setApiKeyDialogOpen(false);
    toast.success("API key saved successfully");
    
    // Auto-submit the question if one is entered
    if (question.trim()) {
      handleQuestionSubmit(new Event('submit') as any);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setQuestion(transcript);
    setVoiceInputOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card className="medical-card">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            <span>Gemini Health Advisor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask a health question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-grow"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setVoiceInputOpen(true)}
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </div>
                )}
              </Button>
            </div>
          </form>

          {response && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-lg font-semibold text-indigo-700">
                <FileText className="h-5 w-5" />
                <h3>Gemini's Response</h3>
              </div>
              <div className="whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-gray-700">
                {response}
              </div>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">
            <p>
              Powered by Google Gemini AI. Responses are generated by AI and should not replace professional medical advice.
              Always consult with a healthcare professional for medical concerns.
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Gemini API Key</DialogTitle>
            <DialogDescription>
              This key is required to use Gemini AI features. You can get an API key from the Google AI Studio.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Your API key is only stored in your browser and is never sent to our servers.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApiKeySave}>
                Save & Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <VoiceInput
        isOpen={voiceInputOpen}
        onClose={() => setVoiceInputOpen(false)}
        onTranscript={handleVoiceInput}
      />
    </div>
  );
};

export default GeminiHealthAdvisor;
