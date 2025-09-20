import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, BookOpen, Phone, Globe, Heart, Shield } from "lucide-react";

const YouthResources = () => {
  const resources = [
    {
      title: "National Alliance on Mental Illness (NAMI)",
      description: "Support, education and advocacy for individuals and families affected by mental health conditions.",
      website: "https://nami.org/Your-Journey/Teens-Young-Adults",
      category: "Support Organizations",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Mental Health America",
      description: "Resources, screening tools, and information about mental health conditions.",
      website: "https://mhanational.org/issues/mental-health-teens",
      category: "Information & Screening",
      icon: Heart,
      color: "text-red-500"
    },
    {
      title: "JED Campus", 
      description: "Mental health resources specifically for college students and campus communities.",
      website: "https://jedfoundation.org/students/",
      category: "College Support",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Active Minds",
      description: "Student-run mental health advocacy and awareness organization on college campuses.",
      website: "https://activeminds.org/",
      category: "Peer Support", 
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Crisis Text Line",
      description: "Free, 24/7 crisis support via text message with trained crisis counselors.",
      website: "https://crisistextline.org/",
      category: "Crisis Support",
      icon: Phone,
      color: "text-orange-600"
    },
    {
      title: "National Suicide Prevention Lifeline",
      description: "24/7, free and confidential support for people in distress and prevention resources.",
      website: "https://suicidepreventionlifeline.org/",
      category: "Crisis Support",
      icon: Shield,
      color: "text-red-600"
    },
    {
      title: "Mental Health First Aid",
      description: "Learn how to identify, understand and respond to signs of mental illnesses and substance use disorders.",
      website: "https://mentalhealthfirstaid.org/",
      category: "Education",
      icon: BookOpen,
      color: "text-indigo-600"
    },
    {
      title: "The Trevor Project",
      description: "Crisis intervention and suicide prevention services for LGBTQ+ young people.",
      website: "https://thetrevorproject.org/",
      category: "LGBTQ+ Support",
      icon: Heart,
      color: "text-pink-600"
    },
    {
      title: "National Eating Disorders Association",
      description: "Support, resources and treatment options for eating disorders.",
      website: "https://nationaleatingdisorders.org/",
      category: "Specialized Support",
      icon: Heart,
      color: "text-teal-600"
    }
  ];

  const categories = [...new Set(resources.map(r => r.category))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg md:text-xl">Mental Health Resources for Youth</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Professional resources, support organizations, and educational materials to help you on your mental wellness journey.
          </p>
        </CardHeader>
      </Card>

      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base text-gray-800">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {resources
                .filter(resource => resource.category === category)
                .map((resource, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`p-2 rounded-full bg-white ${resource.color}`}>
                      <resource.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm md:text-base">{resource.title}</h4>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">{resource.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-xs"
                      onClick={() => window.open(resource.website, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-blue-800 font-medium">Important Reminder</p>
              <p className="text-xs text-blue-700">
                These resources are provided for educational purposes. If you're experiencing a mental health crisis, 
                please contact emergency services (911) or a crisis hotline immediately. Your safety and wellbeing are the top priority.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouthResources;