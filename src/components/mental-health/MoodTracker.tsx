import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { SmilePlus, TrendingUp } from "lucide-react";
import { moodOptions, activityOptions, MoodEntry } from "./mentalHealthTypes";
import { cn } from "@/lib/utils";

interface MoodTrackerProps {
  onAddEntry: (entry: Omit<MoodEntry, "id" | "date">) => void;
  recentEntries: MoodEntry[];
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onAddEntry, recentEntries }) => {
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    const moodOption = moodOptions.find((m) => m.value === selectedMood);
    if (!moodOption) return;

    onAddEntry({
      mood: selectedMood,
      moodLabel: moodOption.label,
      stressLevel,
      activities: selectedActivities,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setSelectedMood(3);
    setStressLevel(5);
    setSelectedActivities([]);
    setNotes("");
    toast.success("Mood logged successfully!");
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity) ? prev.filter((a) => a !== activity) : [...prev, activity]
    );
  };

  const selectedMoodOption = moodOptions.find((m) => m.value === selectedMood);

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <SmilePlus className="h-5 w-5" />
          Track Your Mood
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Mood Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">How are you feeling?</label>
          <div className="flex justify-between gap-2">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all",
                  selectedMood === mood.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs text-muted-foreground">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stress Level */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">Stress Level</label>
            <span className="text-sm text-muted-foreground">{stressLevel}/10</span>
          </div>
          <Slider
            value={[stressLevel]}
            onValueChange={(value) => setStressLevel(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Activities */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Today's Activities</label>
          <div className="flex flex-wrap gap-2">
            {activityOptions.map((activity) => (
              <Badge
                key={activity}
                variant={selectedActivities.includes(activity) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedActivities.includes(activity) && "bg-primary"
                )}
                onClick={() => toggleActivity(activity)}
              >
                {activity}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Notes (optional)</label>
          <Textarea
            placeholder="How was your day? Any thoughts or feelings..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <SmilePlus className="h-4 w-4 mr-2" />
          Log Mood
        </Button>

        {/* Quick Stats */}
        {recentEntries.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <TrendingUp className="h-4 w-4" />
              <span>Last {Math.min(recentEntries.length, 3)} entries</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {recentEntries.slice(-3).reverse().map((entry) => {
                const mood = moodOptions.find((m) => m.value === entry.mood);
                return (
                  <div
                    key={entry.id}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                  >
                    <span className="text-lg">{mood?.emoji}</span>
                    <div className="text-xs">
                      <div className="font-medium text-foreground">{mood?.label}</div>
                      <div className="text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
