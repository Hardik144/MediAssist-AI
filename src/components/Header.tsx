
import React from "react";
import { HeartPulse } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="bg-gradient-primary py-6 md:py-8 px-4 md:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-10 animate-float">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="absolute top-12 right-20 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-8 left-1/4 animate-float" style={{ animationDelay: '4s' }}>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      </div>
      
      <div className="container mx-auto relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 text-white mb-4 md:mb-0 text-center md:text-left animate-slide-up">
            <div className="bg-white/20 p-3 md:p-4 rounded-2xl pulse-animation backdrop-blur-sm">
              <HeartPulse className="h-7 w-7 md:h-9 md:w-9" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-jakarta">
                <span className="text-white drop-shadow-lg">MindSpace</span>
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-md font-medium drop-shadow-sm">
                Your safe, confidential AI companion for mental wellness
              </p>
            </div>
          </div>
          
          {/* Stats and Theme Toggle */}
          <div className="flex items-center gap-4">
            {!isMobile ? (
              <div className="flex items-center gap-8 text-sm text-white/90 animate-fade-in">
                <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-2xl md:text-3xl font-bold text-white">100k+</span>
                  <span className="font-medium">Youth Supported</span>
                </div>
                <div className="h-12 w-px bg-white/30"></div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-2xl md:text-3xl font-bold text-white">100%</span>
                  <span className="font-medium">Confidential</span>
                </div>
                <div className="h-12 w-px bg-white/30"></div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <span className="text-2xl md:text-3xl font-bold text-white">24/7</span>
                  <span className="font-medium">Always Here</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 text-xs text-white/90 w-full animate-fade-in">
                <div className="flex flex-col items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <span className="text-lg font-bold text-white">100k+</span>
                  <span className="font-medium">Supported</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <span className="text-lg font-bold text-white">100%</span>
                  <span className="font-medium">Private</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <span className="text-lg font-bold text-white">24/7</span>
                  <span className="font-medium">Here</span>
                </div>
              </div>
            )}
            
            {/* Theme Toggle */}
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
