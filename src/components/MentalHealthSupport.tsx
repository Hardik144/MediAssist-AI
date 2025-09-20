import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, MessageCircle, Send, Shield, Key } from "lucide-react";
import { toast } from "sonner";
import VoiceInput from "./VoiceInput";
import { getMentalWellnessSupport, getMentalWellnessApiKey, setMentalWellnessApiKey } from "@/services/mentalWellnessService";

const MentalHealthSupport = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState(getMentalWellnessApiKey());
  const [voiceInputOpen, setVoiceInputOpen] = useState(false);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Please share what's on your mind");
      return;
    }

    // Check if API key is set
    if (!getMentalWellnessApiKey()) {
      setApiKeyDialogOpen(true);
      return;
    }

    setIsLoading(true);
    
    try {
      const aiResponse = await getMentalWellnessSupport(question);
      setResponse(aiResponse);
      toast.success("Response ready - remember, you're not alone in this");
    } catch (error) {
      console.error("Error getting mental wellness support:", error);
      toast.error("I'm having trouble connecting right now. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySave = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    setMentalWellnessApiKey(apiKey);
    setApiKeyDialogOpen(false);
    toast.success("API key saved securely");
    
    // Auto-submit question if there is one
    if (question.trim()) {
      handleQuestionSubmit(new Event('submit') as any);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setQuestion(transcript);
    setVoiceInputOpen(false);
  };

  const quickQuestions = [
    "I'm feeling really anxious about school and don't know how to cope",
    "I feel like I don't fit in and I'm always lonely",
    "I'm having trouble sleeping because of worrying thoughts",
    "How do I deal with stress from my parents and their expectations?",
    "I feel overwhelmed and like everything is too much"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <CardTitle className="text-lg md:text-xl">AI Mental Health Companion</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Share whatever is on your mind. This is a safe, confidential space where you can express your feelings without judgment.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Shield className="h-3 w-3" />
            <span>Your conversations are private and secure</span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium">
                What's on your mind? I'm here to listen and support you.
              </Label>
              <div className="relative">
                <Textarea
                  id="question"
                  placeholder="You can share anything - your worries, fears, stress, or just how you're feeling today. There's no judgment here."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[100px] resize-none pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-2 right-2 h-8 w-8 p-0"
                  onClick={() => setVoiceInputOpen(true)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Getting personalized support...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Get Support & Guidance
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Common concerns teens share:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {quickQuestions.map((q, index) => (
              <button
                key={index}
                className="text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 transition-colors"
                onClick={() => setQuestion(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Response */}
      {response && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <CardTitle className="text-base">Personalized Support</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                {response}
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-700 flex items-start gap-2">
                <Shield className="h-3 w-3 mt-0.5" />
                <span>
                  <strong>Remember:</strong> This AI support is designed to provide emotional guidance and coping strategies. 
                  If you're in crisis or having thoughts of self-harm, please reach out to a crisis hotline or emergency services immediately.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Connect AI Support
            </DialogTitle>
            <DialogDescription>
              To access personalized mental wellness support, please enter your Gemini API key. 
              This enables the AI companion to provide tailored guidance and support.
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
                Your API key is encrypted and stored securely in your browser only. 
                It's never shared with our servers.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setApiKeyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleApiKeySave}>
                Save & Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Voice Input Component */}
      <VoiceInput
        isOpen={voiceInputOpen}
        onClose={() => setVoiceInputOpen(false)}
        onTranscript={handleVoiceInput}
      />
    </div>
  );
};

export default MentalHealthSupport;