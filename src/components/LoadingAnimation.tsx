
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Stethoscope, LoaderCircle } from "lucide-react";

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
          return 100;
        }
        return Math.min(prev + 1.5, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepIndex = Math.min(Math.floor(progress / 20), steps.length - 1);
    setCurrentStep(stepIndex);
  }, [progress]);

  return (
    <Card className="medical-card overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-medical-primary to-medical-accent p-4">
        <h3 className="text-white text-lg font-medium flex items-center gap-2">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Processing Your Health Information
        </h3>
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-8 py-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-12 w-12 text-primary animate-breathe" />
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full animate-pulse"></span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800">
            {steps[currentStep]}
          </h3>
          
          <div className="w-full space-y-3">
            <Progress value={progress} className="h-2.5" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Analyzing medical data...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 max-w-md">
            <p>
              Our advanced AI is analyzing your symptoms using a comprehensive database of medical knowledge. 
              Please wait while we prepare your personalized health recommendations.
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
                <span className="text-[10px] text-center hidden md:block">{step.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingAnimation;
