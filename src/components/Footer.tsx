import React from "react";
import { Heart, Shield, Users, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const quickLinks = [
    { name: "Crisis Support", icon: Phone, href: "#crisis" },
    { name: "Resources", icon: Users, href: "#resources" },
    { name: "About Us", icon: Heart, href: "#about" },
    { name: "Privacy Policy", icon: Shield, href: "#privacy" },
  ];

  const crisisResources = [
    { name: "Crisis Text Line", contact: "Text HOME to 741741", description: "Free 24/7 crisis support" },
    { name: "National Suicide Prevention Lifeline", contact: "988", description: "24/7 suicide prevention support" },
    { name: "Teen Line", contact: "1-800-852-8336", description: "Teens helping teens (6pm-10pm PT)" },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">MindSpace</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-base leading-relaxed">
              A safe, confidential space where young people can access mental wellness support, 
              find resources, and connect with caring AI-powered guidance.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Shield className="h-4 w-4" />
                <span>100% Confidential & Private</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Heart className="h-4 w-4" />
                <span>Youth-Focused Support</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Users className="h-4 w-4" />
                <span>Professional Resources</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 p-0 h-auto"
                >
                  <div className="flex items-center gap-3 py-2">
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Crisis Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Crisis Support</h4>
            <div className="space-y-4">
              {crisisResources.map((resource, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-1 text-sm">{resource.name}</h5>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{resource.contact}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{resource.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Notice</h5>
                <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                  MindSpace provides emotional support and resources but is not a replacement for professional mental health care. 
                  If you're experiencing severe distress or having thoughts of self-harm, please contact emergency services or a crisis hotline immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 dark:text-gray-400">
            <p className="text-sm">
              © 2024 MindSpace. Made with <Heart className="h-4 w-4 inline text-red-500" /> for mental wellness.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;