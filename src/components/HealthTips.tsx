
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const HealthTips = () => {
  const healthTips = [
    {
      title: "Stay Hydrated",
      description: "Aim to drink 8-10 glasses of water daily to maintain proper bodily functions.",
      icon: "💧"
    },
    {
      title: "Quality Sleep",
      description: "Adults should get 7-9 hours of quality sleep each night.",
      icon: "😴"
    },
    {
      title: "Regular Exercise",
      description: "Engage in at least 150 minutes of moderate exercise per week.",
      icon: "🏃‍♂️"
    },
    {
      title: "Balanced Diet",
      description: "Consume a variety of fruits, vegetables, whole grains, and lean proteins.",
      icon: "🥗"
    },
    {
      title: "Manage Stress",
      description: "Practice meditation or relaxation techniques to reduce chronic stress.",
      icon: "🧘‍♀️"
    },
    {
      title: "Regular Check-ups",
      description: "Schedule preventive health screenings and annual check-ups.",
      icon: "🩺"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Heart className="h-5 w-5 text-primary" />
          Daily Health Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthTips.map((tip, index) => (
            <div 
              key={tip.title}
              className="p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="text-2xl mb-2">{tip.icon}</div>
              <h4 className="font-medium text-foreground mb-1">{tip.title}</h4>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthTips;
