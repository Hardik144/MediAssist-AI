
import React, { useState, useEffect } from "react";
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
import { Heart, Stethoscope, ClipboardList, History, Brain, Globe, Pill, Activity, MapPin, Camera, IdCard, Newspaper, ArrowLeft } from "lucide-react";
import { useSymptomHistory } from "@/hooks/use-symptom-history";
import MedicationReminders from "@/components/MedicationReminders";
import SymptomHistory from "@/components/SymptomHistory";
import { getGeminiApiKey, getHealthConditionInfo, setGeminiApiKey, availableLanguages } from "@/services/geminiService";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import DrugInteractionChecker from "@/components/DrugInteractionChecker";
import HealthProgressTracker from "@/components/HealthProgressTracker";
import DoctorDirectory from "@/components/DoctorDirectory";
import MedicineScanner from "@/components/MedicineScanner";
import EmergencyInfoCard from "@/components/EmergencyInfoCard";
import HealthNewsFeed from "@/components/HealthNewsFeed";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("symptoms");
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [preferredLanguage, setPreferredLanguage] = useState("english");
  const [targetLanguage, setTargetLanguage] = useState("english");
  const { addSymptom, history } = useSymptomHistory();
  const isMobile = useIsMobile();

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
    setCurrentTab("results");
    
    try {
      // Get health condition data from Gemini API with language preference
      const healthData = await getHealthConditionInfo(symptoms, preferredLanguage);
      setResults(healthData);
      
      // Add to symptom history
      addSymptom(symptoms, healthData);
      
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error getting health data:", error);
      toast.error("Failed to analyze symptoms. Please try again.");
      setCurrentTab("symptoms");
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
      const lastSymptom = history[0].symptom;
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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary py-12 md:py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="container relative px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              Your Health, Simplified
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Get instant health insights powered by AI. Check symptoms, track wellness, and access medical resources—all in one place.
            </p>
          </div>
        </div>
      </section>
      
      <main className="container px-4 md:px-6 py-8 md:py-12 -mt-8 relative z-10">
        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Main tabs - modern design */}
          <TabsList className="w-full mb-6 md:mb-10 bg-card border border-border shadow-[var(--shadow-soft)] rounded-2xl p-2 grid grid-cols-2 md:flex md:justify-center gap-2">
            <TabsTrigger value="symptoms" className="flex items-center gap-2 text-sm md:text-base py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Check Symptoms</span>
              <span className="sm:hidden">Symptoms</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2 text-sm md:text-base py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all" disabled={!results && !isLoading}>
              <ClipboardList className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
            <TabsTrigger value="ai-advisor" className="flex items-center gap-2 text-sm md:text-base py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Advisor</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2 text-sm md:text-base py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Heart className="h-4 w-4" />
              <span>Resources</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex flex-wrap justify-end gap-3 mb-6">
            <Button
              variant="outline"
              size="default"
              className="flex items-center gap-2 rounded-xl border-2"
              onClick={handleHistory}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </Button>
            <Button
              variant="outline"
              size="default"
              className="flex items-center gap-2 rounded-xl border-2"
              onClick={handleReminders}
            >
              <History className="h-4 w-4" />
              <span>Reminders</span>
            </Button>
          </div>
          
          <TabsContent value="symptoms" className="space-y-8">
            <Card className="medical-card p-6 md:p-8">
              <SymptomForm onSubmit={handleSymptomSubmit} />
            </Card>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Explore Health Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="feature-card group" onClick={() => setCurrentTab("drug-interaction")}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Pill className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-base">Drug Interaction</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Check if your medications interact safely</p>
                </div>
                
                <div className="feature-card group" onClick={() => setCurrentTab("health-tracker")}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-base">Health Tracker</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Monitor symptoms and health metrics</p>
                </div>
                
                <div className="feature-card group" onClick={() => setCurrentTab("doctor-directory")}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-red-500/10 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-base">Doctor Directory</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Find and book healthcare providers</p>
                </div>
                
                <div className="feature-card group" onClick={() => setCurrentTab("medicine-scanner")}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <Camera className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-base">Medicine Scanner</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Scan packaging for medication info</p>
                </div>
                
                <div className="feature-card group" onClick={() => setCurrentTab("emergency-info")}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <IdCard className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-base">Emergency Info</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Create medical emergency card</p>
                </div>
                
                <div className="feature-card group" onClick={() => setCurrentTab("health-news")}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Newspaper className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-base">Health News</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Stay updated with health articles</p>
                </div>
              </div>
            </div>
            
            <TrendingSymptoms onSelect={(symptom) => {
              // Auto-fill the form and trigger search
              handleSymptomSubmit(symptom);
            }} />
            
            <InfoSection />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingAnimation />
                <p className="mt-6 text-sm text-muted-foreground">
                  Analyzing your symptoms...
                </p>
              </div>
            ) : results ? (
              <ResultsDisplay results={results} />
            ) : (
              <Card className="medical-card p-12 text-center">
                <ClipboardList className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-base text-muted-foreground mb-4">No results to display yet. Check your symptoms first.</p>
                <Button 
                  onClick={() => setCurrentTab("symptoms")} 
                  size="lg"
                  className="rounded-xl"
                >
                  Check Symptoms Now
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ai-advisor" className="space-y-4 md:space-y-8">
            <GeminiHealthAdvisor />
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4 md:space-y-8">
            <MedicalResourcesSection />
            <HealthTips />
          </TabsContent>

          {/* Feature tabs with back buttons */}
          {["drug-interaction", "health-tracker", "doctor-directory", 
            "medicine-scanner", "emergency-info", "health-news"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-6">
              <Button 
                variant="outline" 
                size="default"
                className="flex items-center gap-2 rounded-xl border-2"
                onClick={() => setCurrentTab("symptoms")}
              >
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Button>
              
              {tabValue === "drug-interaction" && <DrugInteractionChecker />}
              {tabValue === "health-tracker" && <HealthProgressTracker />}
              {tabValue === "doctor-directory" && <DoctorDirectory />}
              {tabValue === "medicine-scanner" && <MedicineScanner />}
              {tabValue === "emergency-info" && <EmergencyInfoCard />}
              {tabValue === "health-news" && <HealthNewsFeed />}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">Enter Gemini API Key</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              This key is required to use the symptom analyzer and Gemini AI features. You can get an API key from the Google AI Studio.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-xs md:text-sm h-8 md:h-10"
              />
              <p className="text-[10px] md:text-xs text-gray-500">
                Your API key is only stored in your browser and is never sent to our servers.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setApiKeyDialogOpen(false)} 
                size={isMobile ? "sm" : "default"}
                className="text-xs md:text-sm h-8 md:h-10"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApiKeySave}
                size={isMobile ? "sm" : "default"}
                className="text-xs md:text-sm h-8 md:h-10"
              >
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
