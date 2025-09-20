import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, Phone, MessageCircle, BookOpen, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface WellnessGuidanceProps {
  results: any;
}

const WellnessGuidance: React.FC<WellnessGuidanceProps> = ({ results }) => {
  const isMobile = useIsMobile();

  const getMoodColor = (mood: string) => {
    switch(mood) {
      case 'very-low': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'good': return 'bg-green-100 text-green-800';
      case 'great': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const crisisResources = [
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      description: "Free 24/7 crisis support"
    },
    {
      name: "National Suicide Prevention Lifeline", 
      contact: "988",
      description: "24/7 suicide prevention and crisis support"
    },
    {
      name: "Teen Line",
      contact: "1-800-852-8336",
      description: "Teens helping teens (6pm-10pm PT)"
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Crisis Resources - Show first if mood is very low */}
      {results?.moodLevel === 'very-low' && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-800 text-lg">Immediate Support Available</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-red-700">
              You're not alone. If you're having thoughts of self-harm or suicide, please reach out now:
            </p>
            {crisisResources.map((resource, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-800">{resource.name}</h4>
                    <p className="text-sm text-red-600">{resource.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    {resource.contact}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mood Assessment */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <CardTitle>Your Wellness Check-In</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Current mood:</span>
            <Badge className={getMoodColor(results?.moodLevel || 'neutral')}>
              {results?.moodLevel?.replace('-', ' ') || 'Not specified'}
            </Badge>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">What you shared:</h4>
            <p className="text-sm text-blue-700 italic">"{results?.feelings}"</p>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis & Support */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <CardTitle>Personalized Support</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {results?.["AI Response"] || results?.response || "Thank you for sharing. Your feelings are valid and it's brave of you to reach out for support."}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      {results?.["Recommended Actions"] && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <CardTitle>Things You Can Try</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {Array.isArray(results["Recommended Actions"]) 
                ? results["Recommended Actions"].map((action: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                      <div className="h-2 w-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-purple-700">{action}</p>
                    </div>
                  ))
                : <p className="text-sm text-purple-700">{results["Recommended Actions"]}</p>
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coping Strategies */}
      {results?.["Coping Strategies"] && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              <CardTitle>Coping Strategies</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {Array.isArray(results["Coping Strategies"]) 
                ? results["Coping Strategies"].map((strategy: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-indigo-50 rounded-lg">
                      <div className="h-2 w-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-indigo-700">{strategy}</p>
                    </div>
                  ))
                : <p className="text-sm text-indigo-700">{results["Coping Strategies"]}</p>
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* When to Seek Help */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-500" />
            <CardTitle>When to Reach Out for More Help</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              {results?.["When to Seek Help"] || "Consider reaching out to a trusted adult, counselor, or mental health professional if you're struggling to cope or if your feelings persist."}
            </p>
            <div className="bg-orange-50 p-3 rounded-lg">
              <h5 className="font-medium text-orange-800 mb-2">Remember:</h5>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Seeking help is a sign of strength, not weakness</li>
                <li>• You deserve support and care</li>
                <li>• Your feelings matter and are valid</li>
                <li>• Things can and do get better</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-gray-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <MessageCircle className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-gray-600 font-medium">Important Note</p>
              <p className="text-xs text-gray-500">
                This AI support is not a replacement for professional mental health care. If you're experiencing severe distress, having thoughts of self-harm, or need immediate help, please contact a crisis hotline or emergency services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellnessGuidance;