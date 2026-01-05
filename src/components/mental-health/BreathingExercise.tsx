import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";
import { breathingExercises, BreathingExercise as BreathingExerciseType } from "./mentalHealthTypes";
import { cn } from "@/lib/utils";

const BreathingExercise: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExerciseType>(breathingExercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "hold2">("inhale");
  const [countdown, setCountdown] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [circleScale, setCircleScale] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = selectedExercise.inhale + selectedExercise.hold + selectedExercise.exhale + (selectedExercise.id === "box" ? selectedExercise.hold : 0);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    let phaseTime = 0;
    let cyclePhase: "inhale" | "hold" | "exhale" | "hold2" = "inhale";
    let cycle = 1;

    const getPhaseTime = (p: typeof cyclePhase) => {
      switch (p) {
        case "inhale": return selectedExercise.inhale;
        case "hold": return selectedExercise.hold;
        case "exhale": return selectedExercise.exhale;
        case "hold2": return selectedExercise.id === "box" ? selectedExercise.hold : 0;
      }
    };

    phaseTime = getPhaseTime("inhale");
    setCountdown(phaseTime);
    setPhase("inhale");
    setCircleScale(1);

    intervalRef.current = setInterval(() => {
      phaseTime--;
      setCountdown(phaseTime);

      // Update circle scale based on phase
      if (cyclePhase === "inhale") {
        const progress = 1 - (phaseTime / getPhaseTime("inhale"));
        setCircleScale(1 + progress * 0.5);
      } else if (cyclePhase === "exhale") {
        const progress = 1 - (phaseTime / getPhaseTime("exhale"));
        setCircleScale(1.5 - progress * 0.5);
      }

      if (phaseTime <= 0) {
        // Move to next phase
        const phases: Array<"inhale" | "hold" | "exhale" | "hold2"> = 
          selectedExercise.id === "box" 
            ? ["inhale", "hold", "exhale", "hold2"] 
            : selectedExercise.hold > 0 
              ? ["inhale", "hold", "exhale"] 
              : ["inhale", "exhale"];
        
        const currentIndex = phases.indexOf(cyclePhase);
        if (currentIndex === phases.length - 1) {
          // End of cycle
          if (cycle >= selectedExercise.cycles) {
            // Exercise complete
            setIsActive(false);
            setPhase("inhale");
            setCountdown(0);
            setCircleScale(1);
            return;
          }
          cycle++;
          setCurrentCycle(cycle);
          cyclePhase = "inhale";
        } else {
          cyclePhase = phases[currentIndex + 1];
        }

        phaseTime = getPhaseTime(cyclePhase);
        setCountdown(phaseTime);
        setPhase(cyclePhase);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, selectedExercise]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentCycle(1);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("inhale");
    setCountdown(0);
    setCurrentCycle(1);
    setCircleScale(1);
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "hold": return "Hold";
      case "exhale": return "Breathe Out";
      case "hold2": return "Hold";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale": return "from-blue-400 to-cyan-400";
      case "hold": return "from-purple-400 to-pink-400";
      case "exhale": return "from-green-400 to-teal-400";
      case "hold2": return "from-orange-400 to-yellow-400";
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Breathing Exercises
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Exercise Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Select Exercise</label>
          <Select
            value={selectedExercise.id}
            onValueChange={(value) => {
              const exercise = breathingExercises.find((e) => e.id === value);
              if (exercise) {
                handleReset();
                setSelectedExercise(exercise);
              }
            }}
            disabled={isActive}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {breathingExercises.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{selectedExercise.description}</p>
        </div>

        {/* Breathing Circle */}
        <div className="flex flex-col items-center py-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer ring */}
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-gradient-to-br opacity-20 transition-transform duration-1000",
                getPhaseColor()
              )}
              style={{ transform: `scale(${circleScale})` }}
            />
            {/* Inner circle */}
            <div
              className={cn(
                "relative w-32 h-32 rounded-full bg-gradient-to-br flex flex-col items-center justify-center transition-transform duration-1000 shadow-lg",
                getPhaseColor()
              )}
              style={{ transform: `scale(${circleScale})` }}
            >
              {isActive ? (
                <>
                  <span className="text-3xl font-bold text-white">{countdown}</span>
                  <span className="text-sm text-white/80">{getPhaseText()}</span>
                </>
              ) : (
                <span className="text-sm text-white font-medium">Ready</span>
              )}
            </div>
          </div>

          {/* Cycle Counter */}
          {isActive && (
            <div className="mt-4 text-sm text-muted-foreground">
              Cycle {currentCycle} of {selectedExercise.cycles}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <Button onClick={handleStart} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Exercise Info */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">{selectedExercise.inhale}s</div>
            <div className="text-xs text-muted-foreground">Inhale</div>
          </div>
          {selectedExercise.hold > 0 && (
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{selectedExercise.hold}s</div>
              <div className="text-xs text-muted-foreground">Hold</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">{selectedExercise.exhale}s</div>
            <div className="text-xs text-muted-foreground">Exhale</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;
