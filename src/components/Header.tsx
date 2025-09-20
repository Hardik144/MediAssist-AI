
import React from "react";
import { HeartPulse } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="bg-gradient-to-r from-medical-primary to-medical-accent py-4 md:py-6 px-3 md:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 text-white mb-3 md:mb-0 text-center md:text-left">
            <div className="bg-white/20 p-2 md:p-3 rounded-full pulse-animation">
              <HeartPulse className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">MindSpace</h1>
              <p className="text-white/80 text-xs md:text-sm max-w-md">
                Your safe, confidential AI companion for mental wellness and emotional support
              </p>
            </div>
          </div>
          
          {!isMobile ? (
            <div className="flex items-center gap-6 text-xs text-white/80">
              <div className="flex flex-col items-center p-2">
                <span className="text-xl md:text-2xl font-bold text-white">100k+</span>
                <span>Youth Supported</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="flex flex-col items-center p-2">
                <span className="text-xl md:text-2xl font-bold text-white">100%</span>
                <span>Confidential</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="flex flex-col items-center p-2">
                <span className="text-xl md:text-2xl font-bold text-white">24/7</span>
                <span>Always Here</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-[10px] md:text-xs text-white/80 w-full">
              <div className="flex flex-col items-center p-1 text-center">
                <span className="text-lg font-bold text-white">100k+</span>
                <span>Supported</span>
              </div>
              <div className="flex flex-col items-center p-1 text-center">
                <span className="text-lg font-bold text-white">100%</span>
                <span>Private</span>
              </div>
              <div className="flex flex-col items-center p-1 text-center">
                <span className="text-lg font-bold text-white">24/7</span>
                <span>Here</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
