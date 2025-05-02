
import React from "react";
import { HeartPulse } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-medical-primary to-medical-accent py-6 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 text-white mb-4 md:mb-0">
            <div className="bg-white/20 p-3 rounded-full pulse-animation">
              <HeartPulse className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">MediAssist AI</h1>
              <p className="text-white/80 max-w-md">
                AI-powered health assistant for symptom analysis and recommendations
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-white/80">
            <div className="flex flex-col items-center p-2">
              <span className="text-2xl font-bold text-white">500k+</span>
              <span>Symptoms Analyzed</span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex flex-col items-center p-2">
              <span className="text-2xl font-bold text-white">98%</span>
              <span>Accuracy Rate</span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex flex-col items-center p-2">
              <span className="text-2xl font-bold text-white">24/7</span>
              <span>Always Available</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
