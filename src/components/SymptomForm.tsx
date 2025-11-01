
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
    "Upset stomach and nausea",
    "Joint pain and swelling",
    "Rash and itching",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);
    
    // Call the parent's onSubmit function after a short delay to show loading animation
    setTimeout(() => {
      onSubmit(symptoms);
      setLoading(false);
    }, 800);
    
    // Reset submitting state after a short delay
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const handleBodyPartSelect = (bodyPart: string) => {
    const symptomPrefix = `Pain or discomfort in my ${bodyPart.toLowerCase()}`;
    setSymptoms(symptomPrefix);
    toast.info(`Selected body part: ${bodyPart}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Symptom Checker</h2>
        <p className="text-base text-muted-foreground">
          Describe your symptoms in detail for the most accurate analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="symptoms" className="text-base font-medium text-foreground">
            What symptoms are you experiencing?
          </Label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              id="symptoms"
              className="pl-12 medical-input text-base h-14"
              placeholder="e.g., headache and fever for 2 days"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            type="button" 
            variant="outline"
            size="default"
            className="flex items-center gap-2 rounded-xl border-2"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="h-4 w-4" />
            <span>History</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            size="default"
            className="flex items-center gap-2 rounded-xl border-2"
            onClick={() => setBodyMapOpen(true)}
          >
            <MapPin className="h-4 w-4" />
            <span>Body Map</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            size="default"
            className="flex items-center gap-2 rounded-xl border-2"
            onClick={() => setVoiceInputOpen(true)}
          >
            <Mic className="h-4 w-4" />
            <span>Voice</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            size="default"
            className="flex items-center gap-2 rounded-xl border-2"
            onClick={() => setRemindersOpen(true)}
          >
            <Bell className="h-4 w-4" />
            <span>Reminders</span>
          </Button>
        </div>

        <Button 
          type="submit" 
          size="lg"
          className="w-full rounded-xl text-base h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground relative overflow-hidden" 
          disabled={isSubmitting}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="absolute inset-0 overflow-hidden">
                <div className="h-full bg-white/20 w-5 blur-sm animate-progress"></div>
              </div>
              <span className="relative z-10 animate-pulse flex items-center">
                <span className="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Analyzing Symptoms...
              </span>
            </div>
          ) : (
            <>Get Health Recommendations</>
          )}
        </Button>
      </form>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-3">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleSymptoms.map((example) => (
            <button
              key={example}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-sm text-foreground transition-all hover:shadow-sm"
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
