import React, { useState } from "react";
import { Heart, Mic, Calendar, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VoiceInput from "./VoiceInput";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface MoodCheckFormProps {
  onSubmit: (feelings: string, moodLevel: string, additionalContext: string) => void;
}

const MoodCheckForm: React.FC<MoodCheckFormProps> = ({ onSubmit }) => {
  const [feelings, setFeelings] = useState("");
  const [moodLevel, setMoodLevel] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceInputOpen, setVoiceInputOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const moodOptions = [
    { value: "very-low", label: "😔 Really struggling", color: "text-red-600" },
    { value: "low", label: "😕 Not great", color: "text-orange-500" },
    { value: "neutral", label: "😐 Okay/Neutral", color: "text-yellow-500" },
    { value: "good", label: "🙂 Pretty good", color: "text-green-500" },
    { value: "great", label: "😊 Feeling great", color: "text-green-600" }
  ];

  const exampleFeelings = [
    "Feeling overwhelmed with school stress",
    "Having trouble sleeping and feeling anxious",
    "Feeling lonely and disconnected from friends",
    "Struggling with self-doubt and confidence",
    "Dealing with family pressure and expectations"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feelings.trim() || !moodLevel) {
      toast.error("Please share how you're feeling and select your current mood");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    
    setTimeout(() => {
      onSubmit(feelings, moodLevel, additionalContext);
      setLoading(false);
    }, 800);
    
    setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-1 md:space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
            <Heart className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">How are you feeling today?</h2>
        <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
          This is your safe space. Share what's on your mind - everything is completely confidential.
        </p>
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-2">
          <Shield className="h-3 w-3" />
          <span>100% Private & Anonymous</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mood-level" className="text-sm font-medium">Current Mood Level</Label>
          <Select value={moodLevel} onValueChange={setMoodLevel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="How would you rate your mood right now?" />
            </SelectTrigger>
            <SelectContent>
              {moodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className={option.color}>{option.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feelings" className="text-sm font-medium">What's going on? Share your thoughts and feelings</Label>
          <div className="relative">
            <Textarea
              id="feelings"
              className="min-h-[100px] resize-none"
              placeholder="You can share anything here - your worries, stress, excitement, struggles... I'm here to listen and help."
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setVoiceInputOpen(true)}
            >
              <Mic className="h-3 w-3" />
              <span className="text-xs">Speak instead</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="context" className="text-sm font-medium">Additional Context (Optional)</Label>
          <Textarea
            id="context"
            className="min-h-[60px] resize-none"
            placeholder="Anything else you'd like to share? School, relationships, family, work..."
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white relative overflow-hidden" 
          disabled={isSubmitting}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="absolute inset-0 overflow-hidden">
                <div className="h-full bg-white/20 w-5 blur-sm animate-progress"></div>
              </div>
              <span className="relative z-10 animate-pulse flex items-center">
                <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Getting personalized support...
              </span>
            </div>
          ) : (
            <>Get Personalized Support & Guidance</>
          )}
        </Button>
      </form>

      <div className="pt-3 md:pt-4 border-t border-gray-100">
        <p className="text-xs md:text-sm text-gray-500 mb-2">Common feelings teens share:</p>
        <div className="flex flex-wrap gap-1 md:gap-2">
          {exampleFeelings.map((example) => (
            <button
              key={example}
              className="px-2 md:px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-full text-xs md:text-sm text-blue-700 transition-colors"
              onClick={() => setFeelings(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
      
      <VoiceInput
        isOpen={voiceInputOpen}
        onClose={() => setVoiceInputOpen(false)}
        onTranscript={(transcript) => setFeelings(transcript)}
      />
    </div>
  );
};

export default MoodCheckForm;