import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, SmilePlus, ClipboardCheck, Wind, Activity } from "lucide-react";
import { useMentalHealth } from "@/hooks/use-mental-health";
import MoodTracker from "./mental-health/MoodTracker";
import DailyCheckIn from "./mental-health/DailyCheckIn";
import BreathingExercise from "./mental-health/BreathingExercise";
import StressMonitor from "./mental-health/StressMonitor";
import { useIsMobile } from "@/hooks/use-mobile";

const MentalHealthSupport: React.FC = () => {
  const {
    moodEntries,
    checkIns,
    addMoodEntry,
    addCheckIn,
    getRecentMoods,
    getRecentCheckIns,
    getAverages,
  } = useMentalHealth();

  const isMobile = useIsMobile();

  // Check if user has checked in today
  const today = new Date().toDateString();
  const todayCheckIn = checkIns.find(
    (c) => new Date(c.date).toDateString() === today
  );

  const recentMoods = getRecentMoods(7);
  const averages = getAverages(30);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Brain className="h-5 w-5 md:h-6 md:w-6" />
            Mental Health Support
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground text-sm md:text-base">
            Track your mood, complete daily check-ins, practice breathing exercises, and monitor your mental wellness over time.
          </p>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="mood" className="w-full">
        <TabsList className={`grid w-full ${isMobile ? "grid-cols-2 gap-1" : "grid-cols-4"} mb-6`}>
          <TabsTrigger value="mood" className="flex items-center gap-2 text-xs md:text-sm">
            <SmilePlus className="h-4 w-4" />
            <span className={isMobile ? "hidden sm:inline" : ""}>Mood</span>
          </TabsTrigger>
          <TabsTrigger value="checkin" className="flex items-center gap-2 text-xs md:text-sm">
            <ClipboardCheck className="h-4 w-4" />
            <span className={isMobile ? "hidden sm:inline" : ""}>Check-In</span>
          </TabsTrigger>
          <TabsTrigger value="breathing" className="flex items-center gap-2 text-xs md:text-sm">
            <Wind className="h-4 w-4" />
            <span className={isMobile ? "hidden sm:inline" : ""}>Breathe</span>
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2 text-xs md:text-sm">
            <Activity className="h-4 w-4" />
            <span className={isMobile ? "hidden sm:inline" : ""}>Monitor</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mood">
          <MoodTracker onAddEntry={addMoodEntry} recentEntries={recentMoods} />
        </TabsContent>

        <TabsContent value="checkin">
          <DailyCheckIn onAddCheckIn={addCheckIn} todayCheckIn={todayCheckIn} />
        </TabsContent>

        <TabsContent value="breathing">
          <BreathingExercise />
        </TabsContent>

        <TabsContent value="monitor">
          <StressMonitor moodEntries={moodEntries} averages={averages} />
        </TabsContent>
      </Tabs>

      {/* Quick Tips */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="text-lg">💜</span> Mental Health Tips
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Track your mood daily to identify patterns and triggers</li>
            <li>• Practice breathing exercises when feeling anxious or stressed</li>
            <li>• Celebrate small wins and practice gratitude daily</li>
            <li>• Reach out to friends, family, or professionals when needed</li>
            <li>• Remember: It's okay to not be okay sometimes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentalHealthSupport;
