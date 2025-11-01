
import React from "react";
import { HeartPulse } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  return (
    <header className="bg-card border-b border-border backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-md opacity-60"></div>
            <div className="relative bg-gradient-to-br from-primary to-secondary p-2.5 rounded-2xl">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MediAssist AI
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Your intelligent health companion
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
