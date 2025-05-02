import React, { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SymptomForm from "@/components/SymptomForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import LoadingAnimation from "@/components/LoadingAnimation";
import Header from "@/components/Header";
import TrendingSymptoms from "@/components/TrendingSymptoms";
import InfoSection from "@/components/InfoSection";
import MedicalResourcesSection from "@/components/MedicalResourcesSection";
import HealthTips from "@/components/HealthTips";
import GeminiHealthAdvisor from "@/components/GeminiHealthAdvisor";
import { Heart, Stethoscope, ClipboardList, History, Brain } from "lucide-react";
import { useSymptomHistory } from "@/hooks/use-symptom-history";
import MedicationReminders from "@/components/MedicationReminders";
import SymptomHistory from "@/components/SymptomHistory";

// Mock processed result for demonstration
const mockResult = {
  "Disease": "Common Cold",
  "Recommended Medicine": "Acetaminophen (e.g., Tylenol)",
  "Alternative Medicines": ["Ibuprofen (e.g., Advil)", "Nasal decongestants", "Cough suppressants"],
  "Dosage": "Adults: 325-650 mg every 4-6 hours as needed. Don't exceed 3,000 mg in 24 hours.",
  "Precautions": "Avoid alcohol consumption while taking acetaminophen. Not recommended for those with liver disease.",
  "Side Effects": ["Nausea", "Stomach pain", "Headache", "Dizziness"],
  "When to Consult a Doctor": "If symptoms persist for more than 10 days, if you develop a high fever (over 101.3°F or 38.5°C), or if you experience severe throat pain, ear pain, or sinus pain.",
  "Home Remedies": ["Rest and stay hydrated", "Gargle with salt water for sore throat", "Use a humidifier", "Honey and warm lemon water for cough"],
  "Symptom Description": "Common cold symptoms typically include runny or stuffy nose, sneezing, sore throat, mild cough, and sometimes a low-grade fever. These symptoms usually develop 1-3 days after exposure to the virus and can last 7-10 days.",
  "Lifestyle Tips": ["Wash hands frequently", "Get adequate sleep (7-8 hours)", "Stay hydrated", "Eat vitamin C rich foods"],
  "Disclaimer": "This information is for educational purposes only and not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment."
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("symptoms");
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { addSymptom, history } = useSymptomHistory();

  const handleSymptomSubmit = async (symptoms: string) => {
    if (symptoms.trim().length < 3) {
      toast.error("Please enter valid symptoms (at least 3 characters)");
      return;
    }

    setIsLoading(true);
    
    // Simulating API call for demo purposes
    // In a real app, this would call your Flask backend
    setTimeout(() => {
      const newResults = mockResult;
      setResults(newResults);
      setIsLoading(false);
      setCurrentTab("results");
      
      // Add to symptom history
      addSymptom(symptoms, newResults);
      
      toast.success("Analysis complete!");
    }, 3000);
  };

  const handleReminders = () => {
    setRemindersOpen(true);
  };

  const handleHistory = () => {
    setHistoryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container px-4 py-8">
        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="w-full max-w-4xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span>Check Symptoms</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2" disabled={!results && !isLoading}>
              <ClipboardList className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
            <TabsTrigger value="ai-advisor" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>AI Advisor</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Health Resources</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleHistory}
            >
              <History className="h-4 w-4" />
              <span>Symptom History</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleReminders}
            >
              <History className="h-4 w-4" />
              <span>Medication Reminders</span>
            </Button>
          </div>
          
          <TabsContent value="symptoms" className="space-y-8">
            <Card className="medical-card p-6 bg-white shadow-lg">
              <SymptomForm onSubmit={handleSymptomSubmit} />
            </Card>
            
            <TrendingSymptoms onSelect={(symptom) => {
              // Auto-fill the form and trigger search
              handleSymptomSubmit(symptom);
            }} />
            
            <InfoSection />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-8">
            {isLoading ? (
              <LoadingAnimation />
            ) : results ? (
              <ResultsDisplay results={results} />
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">No results to display yet. Check your symptoms first.</p>
                <Button 
                  onClick={() => setCurrentTab("symptoms")} 
                  variant="link"
                  className="mt-2"
                >
                  Go to symptom checker
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-advisor" className="space-y-8">
            <GeminiHealthAdvisor />
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-8">
            <MedicalResourcesSection />
            <HealthTips />
          </TabsContent>
        </Tabs>
      </main>
      
      <MedicationReminders
        isOpen={remindersOpen}
        onClose={() => setRemindersOpen(false)}
        recommendedMedicine={results?.["Recommended Medicine"] || ""}
      />

      <SymptomHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectSymptom={(symptom) => {
          handleSymptomSubmit(symptom);
          setHistoryOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
