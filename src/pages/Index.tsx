import React, { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { getGeminiApiKey, getHealthConditionInfo, setGeminiApiKey } from "@/services/geminiService";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("symptoms");
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const { addSymptom, history } = useSymptomHistory();

  const handleSymptomSubmit = async (symptoms: string) => {
    if (symptoms.trim().length < 3) {
      toast.error("Please enter valid symptoms (at least 3 characters)");
      return;
    }

    // Check if API key is set
    if (!getGeminiApiKey()) {
      setApiKeyDialogOpen(true);
      return;
    }

    setIsLoading(true);
    
    try {
      // Get health condition data from Gemini API
      const healthData = await getHealthConditionInfo(symptoms);
      setResults(healthData);
      setCurrentTab("results");
      
      // Add to symptom history
      addSymptom(symptoms, healthData);
      
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error getting health data:", error);
      toast.error("Failed to analyze symptoms. Please try again.");
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
    
    // Auto-submit the last entered symptoms if any
    if (history.length > 0) {
      const lastSymptom = history[0].symptoms;
      handleSymptomSubmit(lastSymptom);
    }
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
      
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Gemini API Key</DialogTitle>
            <DialogDescription>
              This key is required to use the symptom analyzer and Gemini AI features. You can get an API key from the Google AI Studio.
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
