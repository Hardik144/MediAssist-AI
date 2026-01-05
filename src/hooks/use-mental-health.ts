import { useState, useEffect } from "react";
import { MoodEntry, CheckInEntry } from "@/components/mental-health/mentalHealthTypes";

const MOOD_STORAGE_KEY = "mentalHealth_moodEntries";
const CHECKIN_STORAGE_KEY = "mentalHealth_checkIns";

export const useMentalHealth = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedMoods = localStorage.getItem(MOOD_STORAGE_KEY);
        const savedCheckIns = localStorage.getItem(CHECKIN_STORAGE_KEY);

        if (savedMoods) {
          setMoodEntries(JSON.parse(savedMoods));
        }
        if (savedCheckIns) {
          setCheckIns(JSON.parse(savedCheckIns));
        }
      } catch (error) {
        console.error("Failed to load mental health data:", error);
      }
      setIsLoaded(true);
    };

    loadData();
  }, []);

  // Save mood entries
  useEffect(() => {
    if (isLoaded && moodEntries.length > 0) {
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(moodEntries));
    }
  }, [moodEntries, isLoaded]);

  // Save check-ins
  useEffect(() => {
    if (isLoaded && checkIns.length > 0) {
      localStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(checkIns));
    }
  }, [checkIns, isLoaded]);

  const addMoodEntry = (entry: Omit<MoodEntry, "id" | "date">) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setMoodEntries((prev) => [...prev, newEntry]);
    return newEntry;
  };

  const addCheckIn = (entry: Omit<CheckInEntry, "id" | "date">) => {
    const newEntry: CheckInEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setCheckIns((prev) => [...prev, newEntry]);
    return newEntry;
  };

  const deleteMoodEntry = (id: string) => {
    setMoodEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const deleteCheckIn = (id: string) => {
    setCheckIns((prev) => prev.filter((e) => e.id !== id));
  };

  // Get entries from the last N days
  const getRecentMoods = (days: number = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return moodEntries
      .filter((e) => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getRecentCheckIns = (days: number = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return checkIns
      .filter((e) => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Calculate averages
  const getAverages = (days: number = 7) => {
    const recentMoods = getRecentMoods(days);
    const recentCheckIns = getRecentCheckIns(days);

    const avgMood =
      recentMoods.length > 0
        ? recentMoods.reduce((sum, e) => sum + e.mood, 0) / recentMoods.length
        : 0;

    const avgStress =
      recentMoods.length > 0
        ? recentMoods.reduce((sum, e) => sum + e.stressLevel, 0) / recentMoods.length
        : 0;

    const avgWellbeing =
      recentCheckIns.length > 0
        ? recentCheckIns.reduce((sum, e) => sum + e.overallWellbeing, 0) / recentCheckIns.length
        : 0;

    return { avgMood, avgStress, avgWellbeing };
  };

  return {
    moodEntries,
    checkIns,
    isLoaded,
    addMoodEntry,
    addCheckIn,
    deleteMoodEntry,
    deleteCheckIn,
    getRecentMoods,
    getRecentCheckIns,
    getAverages,
  };
};
