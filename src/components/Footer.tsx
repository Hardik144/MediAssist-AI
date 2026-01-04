import React from "react";
import { Twitter, Linkedin, Github, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/hardikpatidar/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/Hardik144/MediAssist-AI.git", label: "GitHub" },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="section-container py-8 md:py-12">
        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} MediAssist AI. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-1">
            {socialLinks.map((social) => (
              <Button
                key={social.label}
                variant="ghost"
                size="icon"
                asChild
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
              >
                <a href={social.href} aria-label={social.label} target="_blank">
                  <social.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Medical Disclaimer:</strong> MediAssist AI provides general health information for educational purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
