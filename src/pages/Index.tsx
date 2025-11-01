
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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        <div className="container relative px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI-Powered Health Analysis
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
              Your Health Assistant,
              <span className="gradient-text block">Reimagined</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in">
              Get instant AI-powered health insights, track your wellness journey, and access trusted medical resources—all in one intelligent platform.
            </p>
          </div>
        </div>
      </section>
      
      <main className="container px-4 md:px-6 pb-20 -mt-12 relative z-10">
        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Main tabs - premium design */}
          <TabsList className="w-full mb-10 glass-effect shadow-[var(--shadow-medium)] rounded-2xl p-2 grid grid-cols-2 md:flex md:justify-center gap-2">
            <TabsTrigger value="symptoms" className="flex items-center gap-2 text-sm md:text-base py-4 px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[var(--shadow-glow)] transition-all duration-300 font-medium">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Check Symptoms</span>
              <span className="sm:hidden">Symptoms</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2 text-sm md:text-base py-4 px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[var(--shadow-glow)] transition-all duration-300 font-medium" disabled={!results && !isLoading}>
              <ClipboardList className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
            <TabsTrigger value="ai-advisor" className="flex items-center gap-2 text-sm md:text-base py-4 px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[var(--shadow-glow)] transition-all duration-300 font-medium">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Advisor</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2 text-sm md:text-base py-4 px-6 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[var(--shadow-glow)] transition-all duration-300 font-medium">
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
          
          <TabsContent value="symptoms" className="space-y-12">
            <Card className="medical-card p-8 md:p-10">
              <SymptomForm onSubmit={handleSymptomSubmit} />
            </Card>
            
            <div>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Comprehensive Health Tools
                </h2>
                <p className="text-lg text-muted-foreground">
                  Everything you need to manage your health in one place
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="feature-card group" onClick={() => setCurrentTab("drug-interaction")}>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3.5 rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Pill className="h-7 w-7" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Drug Interaction</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">Check if your medications interact safely with comprehensive drug database</p>
                  </div>
                </div>
                
                <div className="feature-card group" onClick={() => setCurrentTab("health-tracker")}>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3.5 rounded-2xl bg-secondary/10 text-secondary transition-all duration-500 group-hover:scale-110 group-hover:bg-secondary group-hover:text-secondary-foreground">
                        <Activity className="h-7 w-7" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Health Tracker</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">Monitor symptoms and track health metrics over time with insights</p>
                  </div>
                </div>
                
                <div className="feature-card group" onClick={() => setCurrentTab("doctor-directory")}>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3.5 rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                        <MapPin className="h-7 w-7" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Doctor Directory</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">Find and book appointments with trusted healthcare providers</p>
                  </div>
                </div>
                
                <div className="feature-card group" onClick={() => setCurrentTab("medicine-scanner")}>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3.5 rounded-2xl bg-secondary/10 text-secondary transition-all duration-500 group-hover:scale-110 group-hover:bg-secondary group-hover:text-secondary-foreground">
                        <Camera className="h-7 w-7" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Medicine Scanner</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">Scan medication packaging to get instant information and details</p>
                  </div>
                </div>
                
                <div className="feature-card group" onClick={() => setCurrentTab("emergency-info")}>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3.5 rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                        <IdCard className="h-7 w-7" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Emergency Info</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">Create and store critical medical emergency information card</p>
                  </div>
                </div>
                
                <div className="feature-card group" onClick={() => setCurrentTab("health-news")}>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3.5 rounded-2xl bg-secondary/10 text-secondary transition-all duration-500 group-hover:scale-110 group-hover:bg-secondary group-hover:text-secondary-foreground">
                        <Newspaper className="h-7 w-7" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Health News</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">Stay informed with latest health news and medical breakthroughs</p>
                  </div>
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
