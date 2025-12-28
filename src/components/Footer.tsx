import React from "react";
import { HeartPulse, Mail, Phone, MapPin, Twitter, Linkedin, Github, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const footerLinks = {
    product: [
      { label: "Symptom Checker", action: () => scrollToSection("features") },
      { label: "AI Health Advisor", action: () => scrollToSection("features") },
      { label: "Drug Interactions", action: () => scrollToSection("features") },
      { label: "Health Tracker", action: () => scrollToSection("features") },
    ],
    resources: [
      { label: "Health Tips", action: () => scrollToSection("resources") },
      { label: "Medical Resources", action: () => scrollToSection("resources") },
      { label: "Find Doctors", action: () => scrollToSection("features") },
      { label: "Health News", action: () => scrollToSection("features") },
    ],
    company: [
      { label: "About Us", action: () => scrollToSection("about") },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact", action: () => scrollToSection("about") },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="section-container py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-semibold text-foreground">MediAssist</span>
                <span className="text-lg font-semibold text-primary">AI</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Your intelligent health companion. Get AI-powered health insights, track your wellness journey, and access trusted medical resources.
            </p>
            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              <a href="mailto:support@mediassist.ai" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                support@mediassist.ai
              </a>
              <a href="tel:+1-800-HEALTH" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4" />
                1-800-HEALTH
              </a>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </p>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.action ? (
                    <button
                      onClick={link.action}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
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
                <a href={social.href} aria-label={social.label}>
                  <social.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
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
