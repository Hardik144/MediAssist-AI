
import React, { useState } from "react";
import { Search, History, MapPin, Mic, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SymptomHistory from "./SymptomHistory";
import BodySymptomMap from "./BodySymptomMap";
import VoiceInput from "./VoiceInput";
import MedicationReminders from "./MedicationReminders";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface SymptomFormProps {
  onSubmit: (symptoms: string) => void;
}

const SymptomForm: React.FC<SymptomFormProps> = ({ onSubmit }) => {
  const [symptoms, setSymptoms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [bodyMapOpen, setBodyMapOpen] = useState(false);
  const [voiceInputOpen, setVoiceInputOpen] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const exampleSymptoms = [
    "Headache and fever",
    "Sore throat and cough",
    "Upset stomach",
    "Joint pain",
    "Skin rash",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);
    
    setTimeout(() => {
      onSubmit(symptoms);
      setLoading(false);
    }, 800);
    
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const handleBodyPartSelect = (bodyPart: string) => {
    const symptomPrefix = `Pain or discomfort in my ${bodyPart.toLowerCase()}`;
    setSymptoms(symptomPrefix);
    toast.info(`Selected body part: ${bodyPart}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">Symptom Checker</h2>
        <p className="text-sm text-muted-foreground">
          Describe your symptoms for AI-powered analysis
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="symptoms" className="text-sm font-medium text-foreground">
            What symptoms are you experiencing?
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="symptoms"
              className="pl-10 h-11"
              placeholder="e.g., headache and fever for 2 days"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="h-4 w-4" />
            History
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setBodyMapOpen(true)}
          >
            <MapPin className="h-4 w-4" />
            Body Map
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            onClick={() => setVoiceInputOpen(true)}
          >
            <Mic className="h-4 w-4" />
            Voice
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            onClick={() => setRemindersOpen(true)}
          >
            <Bell className="h-4 w-4" />
            Reminders
          </Button>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          size="lg"
          className="w-full h-11 relative overflow-hidden" 
          disabled={isSubmitting}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              Analyzing...
            </div>
          ) : (
            "Analyze Symptoms"
          )}
        </Button>
      </form>

      {/* Example Symptoms */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleSymptoms.map((example) => (
            <button
              key={example}
              type="button"
              className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-md text-xs text-foreground transition-colors"
              onClick={() => setSymptoms(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
      
      {/* Modals */}
      <SymptomHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectSymptom={(symptom) => setSymptoms(symptom)}
      />
      
      <BodySymptomMap
        isOpen={bodyMapOpen}
        onClose={() => setBodyMapOpen(false)}
        onSelectBodyPart={handleBodyPartSelect}
      />
      
      <VoiceInput
        isOpen={voiceInputOpen}
        onClose={() => setVoiceInputOpen(false)}
        onTranscript={(transcript) => setSymptoms(transcript)}
      />
      
      <MedicationReminders
        isOpen={remindersOpen}
        onClose={() => setRemindersOpen(false)}
      />
    </div>
  );
};

export default SymptomForm;
