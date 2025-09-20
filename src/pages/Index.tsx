
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
import AnimatedBot from "@/components/AnimatedBot";
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
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 transition-colors duration-300">
      <Header />
      
      {/* Calming background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-blue-200/40 dark:bg-blue-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-teal-200/30 dark:bg-teal-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-pink-200/40 dark:bg-pink-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>
      
      <main className="container px-4 md:px-6 py-6 md:py-8 relative z-10">
        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="w-full max-w-5xl mx-auto"
        >
          {/* Modern tabs with reduced gaps */}
          <TabsList className="w-full mb-6 md:mb-8 bg-card/90 backdrop-blur-md border border-border/50 shadow-xl rounded-2xl p-1">
            <div className={`${isMobile ? 'w-full grid grid-cols-2 gap-1' : 'flex w-full justify-center gap-1'}`}>
              <TabsTrigger 
                value="mood-check" 
                className="flex items-center gap-2 text-sm md:text-base py-2.5 px-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Smile className="h-4 w-4" />
                <span>Mood Check</span>
              </TabsTrigger>
              <TabsTrigger 
                value="guidance" 
                className="flex items-center gap-2 text-sm md:text-base py-2.5 px-3 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-xl transition-all duration-200 hover:scale-105" 
                disabled={!results && !isLoading}
              >
                <Heart className="h-4 w-4" />
                <span>Guidance</span>
              </TabsTrigger>
            </div>
            
            <div className={`${isMobile ? 'w-full grid grid-cols-2 gap-1 mt-1' : 'flex gap-1'}`}>
              <TabsTrigger 
                value="ai-support" 
                className="flex items-center gap-2 text-sm md:text-base py-2.5 px-3 data-[state=active]:bg-gradient-secondary data-[state=active]:text-white rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Brain className="h-4 w-4" />
                <span>AI Support</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="flex items-center gap-2 text-sm md:text-base py-2.5 px-3 data-[state=active]:bg-gradient-calm data-[state=active]:text-white rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Globe className="h-4 w-4" />
                <span>Resources</span>
              </TabsTrigger>
            </div>
          </TabsList>
          
          <div className="flex flex-wrap justify-end gap-2 mb-3 md:mb-4 animate-fade-in">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-1 text-xs md:text-sm h-8 md:h-10 border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/10 transition-all duration-200"
              onClick={handleHistory}
            >
              <History className="h-3 w-3 md:h-4 md:w-4" />
              <span>Mood History</span>
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="flex items-center gap-1 text-xs md:text-sm h-8 md:h-10 border-red-200 bg-red-50/80 text-red-700 hover:bg-red-100 transition-all duration-200"
              onClick={() => setCurrentTab("crisis-support")}
            >
              <Phone className="h-3 w-3 md:h-4 md:w-4" />
              <span>Crisis Support</span>
            </Button>
          </div>
          
          <TabsContent value="mood-check" className="space-y-6 animate-fade-in">
            <Card className="wellness-card p-6 md:p-8 shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
              <MoodCheckForm onSubmit={handleMoodSubmit} />
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="wellness-card p-4 md:p-6 cursor-pointer group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200/50" onClick={() => setCurrentTab("crisis-support")}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                    <Phone className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-red-800 dark:text-red-200">Crisis Support</h3>
                </div>
                <p className="text-sm md:text-base text-red-700/80 dark:text-red-300/80">Immediate help and crisis resources available 24/7</p>
              </Card>
              
              <Card className="wellness-card p-4 md:p-6 cursor-pointer group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200/50" onClick={() => setCurrentTab("wellness-tips")}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/40 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                    <Heart className="h-5 w-5 md:h-6 md:w-6 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-pink-800 dark:text-pink-200">Wellness Tips</h3>
                </div>
                <p className="text-sm md:text-base text-pink-700/80 dark:text-pink-300/80">Daily mental health tips and mindfulness strategies</p>
              </Card>
              
              <Card className="wellness-card p-4 md:p-6 cursor-pointer group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border-blue-200/50" onClick={() => setCurrentTab("peer-support")}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                    <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-blue-800 dark:text-blue-200">Peer Support</h3>
                </div>
                <p className="text-sm md:text-base text-blue-700/80 dark:text-blue-300/80">Connect with others who understand your journey</p>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="guidance" className="space-y-4 md:space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-4 md:py-8">
                <LoadingAnimation />
                <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
                  Creating your personalized guidance...
                </p>
              </div>
            ) : results ? (
              <WellnessGuidance results={results} />
            ) : (
              <div className="text-center p-4 md:p-8">
                <p className="text-xs md:text-sm text-gray-500">Share your feelings first to get personalized guidance.</p>
                <Button 
                  onClick={() => setCurrentTab("mood-check")} 
                  variant="link"
                  className="mt-2 text-xs md:text-sm"
                >
                  Go to mood check
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-support" className="space-y-6 animate-fade-in">
            <div className="text-center mb-8 animate-slide-up">
              <AnimatedBot size="lg" showHeartbeat />
              <h2 className="text-2xl md:text-3xl font-bold text-gradient-primary mt-4 mb-2">
                Your AI Mental Health Companion
              </h2>
              <p className="text-muted-foreground text-lg">
                I'm here to listen, support, and guide you through any challenges you're facing.
              </p>
            </div>
            <MentalHealthSupport />
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6 animate-fade-in">
            <div className="text-center mb-8 animate-slide-up">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-calm rounded-3xl mb-4 animate-glow">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gradient-warm mb-2">
                Professional Resources
              </h2>
              <p className="text-muted-foreground text-lg">
                Trusted organizations and resources to support your mental wellness journey.
              </p>
            </div>
            <YouthResources />
          </TabsContent>

          {/* Feature tabs */}
          {["crisis-support", "wellness-tips", "peer-support"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-3 md:space-y-4">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-10"
                onClick={() => setCurrentTab("mood-check")}
              >
                <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" /> Back to Dashboard
              </Button>
              
              {tabValue === "crisis-support" && <CrisisSupport />}
              {tabValue === "wellness-tips" && <WellnessTips />}
              {tabValue === "peer-support" && (
                <Card>
                  <div className="p-6 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="text-lg font-semibold mb-2">Peer Support Coming Soon</h3>
                    <p className="text-gray-600">We're working on connecting you with peers who understand your journey.</p>
                  </div>
                </Card>
              )}
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
