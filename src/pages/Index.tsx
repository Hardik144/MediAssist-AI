
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MoodCheckForm from "@/components/MoodCheckForm";
import WellnessGuidance from "@/components/WellnessGuidance";
import LoadingAnimation from "@/components/LoadingAnimation";
import Header from "@/components/Header";
import WellnessTips from "@/components/WellnessTips";
import YouthResources from "@/components/YouthResources";
import CrisisSupport from "@/components/CrisisSupport";
import MentalHealthSupport from "@/components/MentalHealthSupport";
import { Heart, Smile, ClipboardList, History, Brain, Globe, Users, Activity, MessageCircle, Shield, Phone, BookOpen, ArrowLeft } from "lucide-react";
import { useSymptomHistory } from "@/hooks/use-symptom-history";
import MedicationReminders from "@/components/MedicationReminders";
import SymptomHistory from "@/components/SymptomHistory";
import { getMentalWellnessApiKey, getPersonalizedWellnessGuidance, setMentalWellnessApiKey, availableLanguages } from "@/services/mentalWellnessService";
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
  const [currentTab, setCurrentTab] = useState("mood-check");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState(getMentalWellnessApiKey());
  const [preferredLanguage, setPreferredLanguage] = useState("english");
  const [targetLanguage, setTargetLanguage] = useState("english");
  const { addSymptom, history } = useSymptomHistory();
  const isMobile = useIsMobile();

  const handleMoodSubmit = async (feelings: string, moodLevel: string, additionalContext: string) => {
    if (feelings.trim().length < 10) {
      toast.error("Please share more about how you're feeling");
      return;
    }

    // Check if API key is set
    if (!getMentalWellnessApiKey()) {
      setApiKeyDialogOpen(true);
      return;
    }

    setIsLoading(true);
    setCurrentTab("guidance");
    
    try {
      // Get personalized wellness guidance from AI
      const wellnessData = await getPersonalizedWellnessGuidance(feelings, moodLevel, additionalContext, preferredLanguage);
      setResults(wellnessData);
      
      // Add to mood history (using existing hook for now)
      addSymptom(feelings, wellnessData);
      
      toast.success("Your personalized support is ready 💙");
    } catch (error) {
      console.error("Error getting wellness guidance:", error);
      toast.error("I'm having trouble connecting right now. Please try again in a moment.");
      setCurrentTab("mood-check");
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
    toast.success("API key saved securely 🔒");
    
    // Auto-submit the last entered feelings if any
    if (history.length > 0) {
      const lastEntry = history[0];
      handleMoodSubmit(lastEntry.symptom, 'neutral', '');
    }
  };

  const handleHistory = () => {
    setHistoryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container px-3 md:px-4 py-4 md:py-8">
        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Main tabs - responsive design */}
          <TabsList className="w-full mb-4 md:mb-8 bg-muted flex flex-wrap justify-center">
            <div className={`${isMobile ? 'w-full grid grid-cols-2 gap-1' : 'flex'}`}>
              <TabsTrigger value="mood-check" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm py-1.5 data-[state=active]:bg-white">
                <Smile className="h-3 w-3 md:h-4 md:w-4" />
                <span>Mood Check</span>
              </TabsTrigger>
              <TabsTrigger value="guidance" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm py-1.5 data-[state=active]:bg-white" disabled={!results && !isLoading}>
                <Heart className="h-3 w-3 md:h-4 md:w-4" />
                <span>Guidance</span>
              </TabsTrigger>
            </div>
            
            <div className={`${isMobile ? 'w-full grid grid-cols-2 gap-1 mt-1' : 'flex'}`}>
              <TabsTrigger value="ai-support" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm py-1.5 data-[state=active]:bg-white">
                <Brain className="h-3 w-3 md:h-4 md:w-4" />
                <span>AI Support</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm py-1.5 data-[state=active]:bg-white">
                <Globe className="h-3 w-3 md:h-4 md:w-4" />
                <span>Resources</span>
              </TabsTrigger>
            </div>
          </TabsList>
          
          <div className="flex flex-wrap justify-end gap-2 mb-3 md:mb-4">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-1 text-xs md:text-sm h-8 md:h-10"
              onClick={handleHistory}
            >
              <History className="h-3 w-3 md:h-4 md:w-4" />
              <span>Mood History</span>
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-1 text-xs md:text-sm h-8 md:h-10"
              onClick={() => setCurrentTab("crisis-support")}
            >
              <Phone className="h-3 w-3 md:h-4 md:w-4" />
              <span>Crisis Support</span>
            </Button>
          </div>
          
          <TabsContent value="symptoms" className="space-y-6">
            <Card className="medical-card p-3 md:p-6 shadow-lg">
              <SymptomForm onSubmit={handleSymptomSubmit} />
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <Card className="p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentTab("drug-interaction")}>
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <Pill className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  <h3 className="font-medium text-sm md:text-base">Drug Interaction Checker</h3>
                </div>
                <p className="text-xs md:text-sm text-gray-600">Check if your medications interact with each other</p>
              </Card>
              
              <Card className="p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentTab("health-tracker")}>
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <Activity className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                  <h3 className="font-medium text-sm md:text-base">Health Progress Tracker</h3>
                </div>
                <p className="text-xs md:text-sm text-gray-600">Track your symptoms and health metrics over time</p>
              </Card>
              
              <Card className="p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentTab("doctor-directory")}>
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                  <h3 className="font-medium text-sm md:text-base">Doctor Directory</h3>
                </div>
                <p className="text-xs md:text-sm text-gray-600">Find doctors and book appointments</p>
              </Card>
              
              <Card className="p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentTab("medicine-scanner")}>
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <Camera className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  <h3 className="font-medium text-sm md:text-base">Medicine Scanner</h3>
                </div>
                <p className="text-xs md:text-sm text-gray-600">Scan medicine packaging to get info</p>
              </Card>
              
              <Card className="p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentTab("emergency-info")}>
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <IdCard className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                  <h3 className="font-medium text-sm md:text-base">Emergency Info Card</h3>
                </div>
                <p className="text-xs md:text-sm text-gray-600">Create emergency medical information card</p>
              </Card>
              
              <Card className="p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentTab("health-news")}>
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <Newspaper className="h-4 w-4 md:h-5 md:w-5 text-indigo-600" />
                  <h3 className="font-medium text-sm md:text-base">Health News</h3>
                </div>
                <p className="text-xs md:text-sm text-gray-600">Latest health news and articles</p>
              </Card>
            </div>
            
            <TrendingSymptoms onSelect={(symptom) => {
              // Auto-fill the form and trigger search
              handleSymptomSubmit(symptom);
            }} />
            
            <InfoSection />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4 md:space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-4 md:py-8">
                <LoadingAnimation />
                <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
                  Analyzing symptoms...
                </p>
              </div>
            ) : results ? (
              <ResultsDisplay results={results} />
            ) : (
              <div className="text-center p-4 md:p-8">
                <p className="text-xs md:text-sm text-gray-500">No results to display yet. Check your symptoms first.</p>
                <Button 
                  onClick={() => setCurrentTab("symptoms")} 
                  variant="link"
                  className="mt-2 text-xs md:text-sm"
                >
                  Go to symptom checker
                </Button>
              </div>
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
            <TabsContent key={tabValue} value={tabValue} className="space-y-3 md:space-y-4">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-10"
                onClick={() => setCurrentTab("symptoms")}
              >
                <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" /> Back to Dashboard
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
            <DialogTitle className="text-base md:text-lg">Connect AI Support</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              This key enables personalized mental wellness support. Get your API key from Google AI Studio.
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
                Your API key is encrypted and stored securely in your browser only.
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
      
      <SymptomHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectSymptom={(feeling) => {
          handleMoodSubmit(feeling, 'neutral', '');
          setHistoryOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
