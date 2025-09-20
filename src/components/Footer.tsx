import React from "react";
import { Heart, Shield, Users, Phone, Mail, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const quickLinks = [
    { name: "Crisis Support", icon: Phone, href: "#crisis" },
    { name: "Resources", icon: Users, href: "#resources" },
    { name: "About Us", icon: Heart, href: "#about" },
    { name: "Privacy Policy", icon: Shield, href: "#privacy" },
  ];

  const supportResources = [
    { name: "Crisis Text Line", contact: "Text HOME to 741741" },
    { name: "National Suicide Prevention Lifeline", contact: "988" },
    { name: "Teen Line", contact: "1-800-852-8336" },
  ];

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-teal-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-20 animate-float">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="absolute top-12 right-32 animate-float" style={{ animationDelay: '2s' }}>
          <Heart className="h-3 w-3 text-pink-300" />
        </div>
        <div className="absolute bottom-8 left-1/3 animate-float" style={{ animationDelay: '4s' }}>
          <Users className="h-4 w-4 text-blue-300" />
        </div>
        <div className="absolute bottom-16 right-1/4 animate-float" style={{ animationDelay: '6s' }}>
          <Shield className="h-3 w-3 text-teal-300" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm animate-glow">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">MindSpace</h3>
            </div>
            <p className="text-white/90 mb-6 max-w-md text-lg leading-relaxed">
              A safe, confidential space where young people can access mental wellness support, 
              find resources, and connect with caring AI-powered guidance.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-white/80">
                <Shield className="h-4 w-4" />
                <span>100% Confidential & Private</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Heart className="h-4 w-4" />
                <span>Youth-Focused Support</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Users className="h-4 w-4" />
                <span>Professional Resources</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-gradient-warm">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 p-0 h-auto"
                >
                  <div className="flex items-center gap-3 py-2">
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-gradient-warm">Emergency Support</h4>
            <div className="space-y-4">
              {supportResources.map((resource, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all duration-200">
                  <h5 className="font-medium text-white mb-1 text-sm">{resource.name}</h5>
                  <p className="text-white/80 text-sm">{resource.contact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-300 mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-amber-100 mb-2">Important Notice</h5>
                <p className="text-amber-100/90 text-sm leading-relaxed">
                  MindSpace provides emotional support and resources but is not a replacement for professional mental health care. 
                  If you're experiencing severe distress or having thoughts of self-harm, please contact emergency services or a crisis hotline immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/70">
            <p className="text-sm">
              © 2024 MindSpace. Made with <Heart className="h-4 w-4 inline text-red-400" /> for mental wellness.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </footer>
  );
};

export default Footer;