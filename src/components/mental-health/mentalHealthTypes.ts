export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  moodLabel: string;
  stressLevel: number; // 1-10 scale
  notes?: string;
  activities?: string[];
}

export interface CheckInEntry {
  id: string;
  date: string;
  sleepQuality: number; // 1-5
  energyLevel: number; // 1-5
  anxietyLevel: number; // 1-5
  overallWellbeing: number; // 1-5
  gratitude?: string;
  goals?: string;
}

export const moodOptions = [
  { value: 1, label: "Very Low", emoji: "😢", color: "hsl(var(--destructive))" },
  { value: 2, label: "Low", emoji: "😔", color: "hsl(38 92% 50%)" },
  { value: 3, label: "Neutral", emoji: "😐", color: "hsl(var(--muted-foreground))" },
  { value: 4, label: "Good", emoji: "🙂", color: "hsl(var(--chart-5))" },
  { value: 5, label: "Great", emoji: "😊", color: "hsl(var(--success))" },
];

export const activityOptions = [
  "Exercise",
  "Meditation",
  "Social Time",
  "Work",
  "Hobbies",
  "Nature",
  "Rest",
  "Reading",
  "Music",
  "Family",
];

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
}

export const breathingExercises: BreathingExercise[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal inhale, hold, exhale, and hold. Great for stress relief.",
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 4,
  },
  {
    id: "478",
    name: "4-7-8 Relaxation",
    description: "Calming breath pattern for anxiety and sleep.",
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4,
  },
  {
    id: "energizing",
    name: "Energizing Breath",
    description: "Quick, invigorating pattern to boost energy.",
    inhale: 3,
    hold: 0,
    exhale: 3,
    cycles: 10,
  },
  {
    id: "calm",
    name: "Deep Calm",
    description: "Extended exhale for deep relaxation.",
    inhale: 4,
    hold: 2,
    exhale: 6,
    cycles: 6,
  },
];
