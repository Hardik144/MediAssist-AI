import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  HeartPulse, Pill, AlertTriangle, Home, ClipboardCheck,
  Search, Heart, Download, Share2
} from "lucide-react";
import { toast } from "sonner";

interface ResultsDisplayProps {
  results: any;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);
  
  const downloadResults = () => {
    try {
      const resultsText = Object.entries(results)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}:\n${(value as string[]).map(item => `- ${item}`).join('\n')}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n\n');
      
      const blob = new Blob([resultsText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MediAssist-Results.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Results downloaded successfully");
    } catch (error) {
      toast.error("Failed to download results");
    }
  };
  
  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MediAssist AI Results',
          text: `Here are my health recommendations for ${results.Disease}`,
        });
        toast.success("Shared successfully");
      } catch (error) {
        toast.error("Failed to share results");
      }
    } else {
      toast.error("Sharing is not supported by your browser");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="medical-card overflow-hidden">
        <div className="bg-gradient-to-r from-medical-primary to-medical-accent p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-white" />
            <h3 className="text-white text-lg font-medium">Health Assessment Results</h3>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-white/80"
              onClick={downloadResults}
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Download</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-white/80"
              onClick={shareResults}
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Share</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="condition" className="w-full">
          <TabsList className="grid grid-cols-4 p-1 m-3">
            <TabsTrigger value="condition">Condition</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
            <TabsTrigger value="advice">Advice</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>

          <TabsContent value="condition" className="m-0">
            <CardContent className="p-4 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <HeartPulse className="h-5 w-5 text-medical-primary" />
                  <h4 className="font-semibold text-gray-800">Potential Condition</h4>
                </div>
                <p className="text-gray-700">{results.Disease}</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-5 w-5 text-medical-accent" />
                  <h4 className="font-semibold text-gray-800">Symptom Analysis</h4>
                </div>
                <p className="text-gray-700">{results['Symptom Description']}</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-medical-warning" />
                  <h4 className="font-semibold text-gray-800">When to Consult a Doctor</h4>
                </div>
                <p className="text-gray-700">{results['When to Consult a Doctor']}</p>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="treatment" className="m-0">
            <CardContent className="p-4 space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="h-5 w-5 text-medical-secondary" />
                  <h4 className="font-semibold text-gray-800">Recommended Treatment</h4>
                </div>
                <p className="text-gray-700">{results['Recommended Medicine']}</p>
                
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700">Dosage</h5>
                  <p className="text-sm text-gray-600">{results.Dosage}</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-800">Alternative Medicines</h4>
                </div>
                <ul className="space-y-1">
                  {results['Alternative Medicines'].map((medicine: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-medical-primary">•</span>
                      <span>{medicine}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-medical-danger" />
                  <h4 className="font-semibold text-gray-800">Side Effects & Precautions</h4>
                </div>
                <p className="text-gray-700 mb-2">{results.Precautions}</p>
                
                <h5 className="text-sm font-medium text-gray-700 mt-3">Possible Side Effects:</h5>
                <ul className="space-y-1">
                  {results['Side Effects'].map((effect: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-medical-danger">•</span>
                      <span>{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="advice" className="m-0">
            <CardContent className="p-4 space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-5 w-5 text-indigo-600" />
                  <h4 className="font-semibold text-gray-800">Home Remedies</h4>
                </div>
                <ul className="space-y-1">
                  {results['Home Remedies'].map((remedy: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-indigo-600">•</span>
                      <span>{remedy}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-medical-accent" />
                  <h4 className="font-semibold text-gray-800">Lifestyle Tips</h4>
                </div>
                <ul className="space-y-1">
                  {results['Lifestyle Tips'].map((tip: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-medical-accent">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="info" className="m-0">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">About Your Condition</h4>
                  <p className="text-gray-700">{results['Symptom Description']}</p>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <h4 className="font-semibold text-gray-800 mb-2">Medical Disclaimer</h4>
                  <p className="text-gray-700">
                    {showFullDisclaimer 
                      ? results.Disclaimer 
                      : `${results.Disclaimer.substring(0, 100)}...`}
                  </p>
                  {!showFullDisclaimer && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-medical-primary" 
                      onClick={() => setShowFullDisclaimer(true)}
                    >
                      Read More
                    </Button>
                  )}
                </div>
                
                <div className="text-center text-sm text-gray-500 pt-2">
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
