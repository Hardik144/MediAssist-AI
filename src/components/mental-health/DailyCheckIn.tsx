import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ClipboardCheck, Moon, Zap, Brain, Heart } from "lucide-react";
import { CheckInEntry } from "./mentalHealthTypes";

interface DailyCheckInProps {
  onAddCheckIn: (entry: Omit<CheckInEntry, "id" | "date">) => void;
  todayCheckIn?: CheckInEntry;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onAddCheckIn, todayCheckIn }) => {
  const [sleepQuality, setSleepQuality] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [anxietyLevel, setAnxietyLevel] = useState(3);
  const [overallWellbeing, setOverallWellbeing] = useState(3);
  const [gratitude, setGratitude] = useState("");
  const [goals, setGoals] = useState("");

  const handleSubmit = () => {
    onAddCheckIn({
      sleepQuality,
      energyLevel,
      anxietyLevel,
      overallWellbeing,
      gratitude: gratitude.trim() || undefined,
      goals: goals.trim() || undefined,
    });

    toast.success("Daily check-in completed!");
    
    // Reset form
    setSleepQuality(3);
    setEnergyLevel(3);
    setAnxietyLevel(3);
    setOverallWellbeing(3);
    setGratitude("");
    setGoals("");
  };

  const getScaleLabel = (value: number, type: "positive" | "negative") => {
    if (type === "positive") {
      const labels = ["Very Low", "Low", "Moderate", "Good", "Excellent"];
      return labels[value - 1];
    } else {
      const labels = ["Very Low", "Low", "Moderate", "High", "Very High"];
      return labels[value - 1];
    }
  };

  const metrics = [
    { 
      icon: Moon, 
      label: "Sleep Quality", 
      value: sleepQuality, 
      setter: setSleepQuality, 
      type: "positive" as const,
      color: "text-blue-500"
    },
    { 
      icon: Zap, 
      label: "Energy Level", 
      value: energyLevel, 
      setter: setEnergyLevel, 
      type: "positive" as const,
      color: "text-yellow-500"
    },
    { 
      icon: Brain, 
      label: "Anxiety Level", 
      value: anxietyLevel, 
      setter: setAnxietyLevel, 
      type: "negative" as const,
      color: "text-purple-500"
    },
    { 
      icon: Heart, 
      label: "Overall Wellbeing", 
      value: overallWellbeing, 
      setter: setOverallWellbeing, 
      type: "positive" as const,
      color: "text-red-500"
    },
  ];

  if (todayCheckIn) {
    return (
      <Card>
        <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Daily Check-In Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4">
              <ClipboardCheck className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Great job!</h3>
            <p className="text-muted-foreground">
              You've already completed your check-in for today. Come back tomorrow!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          Daily Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Metrics */}
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                {metric.label}
              </label>
              <span className="text-sm text-muted-foreground">
                {getScaleLabel(metric.value, metric.type)}
              </span>
            </div>
            <Slider
              value={[metric.value]}
              onValueChange={(value) => metric.setter(value[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
          </div>
        ))}

        {/* Gratitude */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            What are you grateful for today?
          </label>
          <Textarea
            placeholder="Three things I'm grateful for..."
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            className="min-h-[60px]"
          />
        </div>

        {/* Goals */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Today's intentions or goals
          </label>
          <Textarea
            placeholder="What do you want to accomplish today?"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="min-h-[60px]"
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
        >
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Complete Check-In
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyCheckIn;
