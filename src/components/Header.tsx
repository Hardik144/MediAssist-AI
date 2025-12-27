
import React from "react";
import { HeartPulse, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const Header = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="section-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-foreground">
                MediAssist
              </span>
              <span className="text-lg font-semibold text-primary">
                AI
              </span>
            </div>
          </div>

          {/* Navigation - can be expanded later */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Features
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Resources
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              About
            </Button>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
