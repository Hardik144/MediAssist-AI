
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
import { Heart, Stethoscope, ClipboardList, History, Brain, Pill, Activity, MapPin, Camera, IdCard, Newspaper, ArrowLeft } from "lucide-react";
import { useSymptomHistory } from "@/hooks/use-symptom-history";
import MedicationReminders from "@/components/MedicationReminders";
import SymptomHistory from "@/components/SymptomHistory";
import { analyzeSymptoms } from "@/services/healthAIService";
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
  const [preferredLanguage, setPreferredLanguage] = useState("english");
  const { addSymptom, history } = useSymptomHistory();
  const isMobile = useIsMobile();

  const handleSymptomSubmit = async (symptoms: string) => {
    if (symptoms.trim().length < 3) {
      toast.error("Please enter valid symptoms (at least 3 characters)");
      return;
    }

    setIsLoading(true);
    setCurrentTab("results");
    
    try {
      // Get health condition data from AI with language preference
      const healthData = await analyzeSymptoms(symptoms, preferredLanguage);
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

  const handleReminders = () => {
    setRemindersOpen(true);
  };

  const handleHistory = () => {
    setHistoryOpen(true);
  };

  const features = [
    { id: "drug-interaction", icon: Pill, title: "Drug Interaction", description: "Check medication safety and interactions" },
    { id: "health-tracker", icon: Activity, title: "Health Tracker", description: "Monitor your health metrics over time" },
    { id: "doctor-directory", icon: MapPin, title: "Find Doctors", description: "Locate healthcare providers near you" },
    { id: "medicine-scanner", icon: Camera, title: "Medicine Scanner", description: "Scan medications for instant info" },
    { id: "emergency-info", icon: IdCard, title: "Emergency Card", description: "Store critical medical information" },
    { id: "health-news", icon: Newspaper, title: "Health News", description: "Latest medical news and updates" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
        
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              AI-Powered Health Analysis
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Your intelligent
              <span className="gradient-text"> health assistant</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Get instant AI-powered health insights, track your wellness journey, and access trusted medical resources.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="section-container pb-20">
        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <TabsList className="w-full sm:w-auto p-1 bg-muted rounded-lg">
              <TabsTrigger value="symptoms" className="flex items-center gap-2 px-4">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Symptoms</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2 px-4" disabled={!results && !isLoading}>
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Results</span>
              </TabsTrigger>
              <TabsTrigger value="ai-advisor" className="flex items-center gap-2 px-4">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI Advisor</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2 px-4">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Resources</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleHistory}
              >
                <History className="h-4 w-4" />
                History
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleReminders}
              >
                <History className="h-4 w-4" />
                Reminders
              </Button>
            </div>
          </div>
          
          {/* Symptoms Tab */}
          <TabsContent value="symptoms" className="space-y-12">
            <Card className="p-6 md:p-8">
              <SymptomForm onSubmit={handleSymptomSubmit} />
            </Card>
            
            {/* Feature Grid */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
                  Health Tools
                </h2>
                <p className="text-muted-foreground">
                  Everything you need to manage your health
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => setCurrentTab(feature.id)}
                    className="feature-card text-left group animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <TrendingSymptoms onSelect={(symptom) => {
              handleSymptomSubmit(symptom);
            }} />
            
            <InfoSection />
          </TabsContent>
          
          {/* Results Tab */}
          <TabsContent value="results" className="space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <LoadingAnimation />
                <p className="mt-6 text-sm text-muted-foreground">
                  Analyzing your symptoms...
                </p>
              </div>
            ) : results ? (
              <ResultsDisplay results={results} />
            ) : (
              <Card className="p-12 text-center">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No results to display yet.</p>
                <Button 
                  onClick={() => setCurrentTab("symptoms")} 
                  size="lg"
                >
                  Check Symptoms
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* AI Advisor Tab */}
          <TabsContent value="ai-advisor" className="space-y-6">
            <GeminiHealthAdvisor />
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <MedicalResourcesSection />
            <HealthTips />
          </TabsContent>

          {/* Feature tabs with back buttons */}
          {["drug-interaction", "health-tracker", "doctor-directory", 
            "medicine-scanner", "emergency-info", "health-news"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-6">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 -ml-2 text-muted-foreground hover:text-foreground"
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
