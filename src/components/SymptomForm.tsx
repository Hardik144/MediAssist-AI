
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
    
    // Call the parent's onSubmit function
    onSubmit(symptoms);
    
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
        <h2 className="text-2xl font-bold text-gray-800">Symptom Checker</h2>
        <p className="text-gray-600">
          Describe your symptoms in detail for the most accurate analysis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="symptoms">What symptoms are you experiencing?</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="symptoms"
              className="pl-10 medical-input"
              placeholder="e.g., headache and fever for 2 days"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setBodyMapOpen(true)}
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Body Map</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setVoiceInputOpen(true)}
          >
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Voice Input</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setRemindersOpen(true)}
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Reminders</span>
          </Button>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-medical-secondary hover:bg-medical-secondary/90 text-white" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-pulse">Analyzing...</span>
            </>
          ) : (
            <>
              Get Health Recommendations
            </>
          )}
        </Button>
      </form>

      <div className="pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-2">Try examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleSymptoms.map((example) => (
            <button
              key={example}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
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
