
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileText, Send, Mic, Brain } from "lucide-react";
import { askHealthQuestion } from "@/services/healthAIService";
import VoiceInput from "./VoiceInput";

const GeminiHealthAdvisor = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceInputOpen, setVoiceInputOpen] = useState(false);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsLoading(true);
    setResponse("");

    try {
      const answer = await askHealthQuestion(question);
      setResponse(answer);
      toast.success("Response received");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get response. Please try again.");
      setResponse("Sorry, there was an error processing your question. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setQuestion(transcript);
    setVoiceInputOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Brain className="h-5 w-5 text-primary" />
            AI Health Advisor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleQuestionSubmit} className="flex gap-2">
            <Input
              placeholder="Ask a health question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline"
              size="icon"
              onClick={() => setVoiceInputOpen(true)}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span className="hidden sm:inline">Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </div>
              )}
            </Button>
          </form>

          {response && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                AI Response
              </div>
              <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm text-foreground">
                {response}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Powered by AI. Responses should not replace professional medical advice.
          </p>
        </CardContent>
      </Card>

      <VoiceInput
        isOpen={voiceInputOpen}
        onClose={() => setVoiceInputOpen(false)}
        onTranscript={handleVoiceInput}
      />
    </div>
  );
};

export default GeminiHealthAdvisor;
