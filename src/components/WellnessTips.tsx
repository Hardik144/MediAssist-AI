import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Moon, Users, Brain, Smile, Activity } from "lucide-react";

const WellnessTips = () => {
  const wellnessTips = [
    {
      title: "Practice Self-Compassion",
      description: "Treat yourself with the same kindness you'd show a good friend. It's okay to have bad days - they don't define you.",
      icon: Heart,
    },
    {
      title: "Prioritize Sleep",
      description: "Aim for 8-9 hours of sleep. Good sleep helps regulate emotions and improves your mood significantly.",
      icon: Moon,
    },
    {
      title: "Connect with Others",
      description: "Reach out to friends, family, or join communities. Social connection is vital for mental wellbeing.",
      icon: Users,
    },
    {
      title: "Mindful Moments", 
      description: "Take 5 minutes daily for mindfulness or meditation. Even short breaks can help reduce stress and anxiety.",
      icon: Brain,
    },
    {
      title: "Find Joy Daily",
      description: "Do something small that makes you smile every day - listen to music, pet an animal, or watch funny videos.",
      icon: Smile,
    },
    {
      title: "Move Your Body",
      description: "Physical activity releases endorphins. Even a 10-minute walk can boost your mood and energy levels.",
      icon: Activity,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          <CardTitle className="text-lg md:text-xl">Daily Wellness Tips</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wellnessTips.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                <tip.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm md:text-base">{tip.title}</h4>
                <p className="text-xs md:text-sm text-gray-600 mt-1">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessTips;