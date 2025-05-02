
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Stethoscope } from "lucide-react";

const LoadingAnimation = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Analyzing Symptoms",
    "Identifying Conditions",
    "Reviewing Medical Database",
    "Preparing Recommendations",
    "Finalizing Results"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepIndex = Math.min(Math.floor(progress / 20), steps.length - 1);
    setCurrentStep(stepIndex);
  }, [progress]);

  return (
    <Card className="medical-card overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-medical-primary to-medical-accent p-4">
        <h3 className="text-white text-lg font-medium">Processing Your Health Information</h3>
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-8 py-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-10 w-10 text-primary animate-breathe" />
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 animate-breathe">
            {steps[currentStep]}
          </h3>
          
          <div className="w-full space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Analysis in progress...</span>
              <span>{progress}%</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 max-w-md">
            <p>
              Our AI is analyzing your symptoms using a database of medical knowledge. 
              This typically takes 15-30 seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-5 w-full gap-2">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col items-center ${index <= currentStep ? "text-primary" : "text-gray-300"}`}
              >
                <div 
                  className={`w-4 h-4 rounded-full mb-1 
                    ${index < currentStep ? "bg-primary" : 
                      index === currentStep ? "bg-primary animate-pulse" : "bg-gray-200"}`}
                ></div>
                <span className="text-[10px] hidden md:block">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingAnimation;
