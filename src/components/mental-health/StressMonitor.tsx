import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { Activity, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { MoodEntry, moodOptions } from "./mentalHealthTypes";
import { format } from "date-fns";

interface StressMonitorProps {
  moodEntries: MoodEntry[];
  averages: { avgMood: number; avgStress: number; avgWellbeing: number };
}

const StressMonitor: React.FC<StressMonitorProps> = ({ moodEntries, averages }) => {
  const [timeRange, setTimeRange] = useState<"7" | "14" | "30">("7");

  // Filter entries by time range
  const filteredEntries = React.useMemo(() => {
    const days = parseInt(timeRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return moodEntries
      .filter((e) => new Date(e.date) >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [moodEntries, timeRange]);

  // Prepare chart data
  const chartData = filteredEntries.map((entry) => ({
    date: format(new Date(entry.date), "MMM d"),
    mood: entry.mood,
    stress: entry.stressLevel,
    fullDate: format(new Date(entry.date), "PPp"),
  }));

  // Calculate trend
  const getTrend = (values: number[]) => {
    if (values.length < 2) return "stable";
    const recent = values.slice(-3);
    const earlier = values.slice(0, 3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    const diff = recentAvg - earlierAvg;
    if (Math.abs(diff) < 0.5) return "stable";
    return diff > 0 ? "up" : "down";
  };

  const moodTrend = getTrend(filteredEntries.map((e) => e.mood));
  const stressTrend = getTrend(filteredEntries.map((e) => e.stressLevel));

  const TrendIcon = ({ trend, isPositiveGood }: { trend: string; isPositiveGood: boolean }) => {
    if (trend === "stable") return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (trend === "up") {
      return isPositiveGood 
        ? <TrendingUp className="h-4 w-4 text-success" />
        : <TrendingUp className="h-4 w-4 text-destructive" />;
    }
    return isPositiveGood 
      ? <TrendingDown className="h-4 w-4 text-destructive" />
      : <TrendingDown className="h-4 w-4 text-success" />;
  };

  const getMoodEmoji = (value: number) => {
    const mood = moodOptions.find((m) => m.value === Math.round(value));
    return mood?.emoji || "😐";
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Stress & Mood Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Time Range Selector */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-foreground">Trend Overview</h3>
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as "7" | "14" | "30")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg Mood</span>
              <TrendIcon trend={moodTrend} isPositiveGood={true} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMoodEmoji(averages.avgMood)}</span>
              <span className="text-xl font-semibold text-foreground">
                {averages.avgMood > 0 ? averages.avgMood.toFixed(1) : "-"}
              </span>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg Stress</span>
              <TrendIcon trend={stressTrend} isPositiveGood={false} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-foreground">
                {averages.avgStress > 0 ? averages.avgStress.toFixed(1) : "-"}
              </span>
              <span className="text-sm text-muted-foreground">/10</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  domain={[0, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="mood"
                  name="Mood (1-5)"
                  stroke="hsl(var(--chart-5))"
                  fill="url(#moodGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="stress"
                  name="Stress (1-10)"
                  stroke="hsl(var(--destructive))"
                  fill="url(#stressGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No data yet. Start tracking your mood!</p>
            </div>
          </div>
        )}

        {/* Insights */}
        {filteredEntries.length >= 3 && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="text-sm font-medium text-foreground mb-2">💡 Insights</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {moodTrend === "up" && (
                <li>• Your mood has been improving! Keep up the good habits.</li>
              )}
              {moodTrend === "down" && (
                <li>• Your mood has been declining. Consider trying some breathing exercises.</li>
              )}
              {stressTrend === "down" && (
                <li>• Great job managing stress! Your levels are decreasing.</li>
              )}
              {stressTrend === "up" && (
                <li>• Stress levels are rising. Take time for self-care today.</li>
              )}
              {averages.avgStress > 7 && (
                <li>• Your average stress is high. Consider speaking with a professional.</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StressMonitor;
