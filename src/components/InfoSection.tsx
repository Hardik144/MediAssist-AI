
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, RefreshCw, Lock } from "lucide-react";

const InfoSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Medical Info",
      description: "All recommendations are based on verified medical knowledge and clinical guidelines."
    },
    {
      icon: RefreshCw,
      title: "Regular Updates",
      description: "Our system is continuously updated with the latest medical research."
    },
    {
      icon: Lock,
      title: "Privacy Focused",
      description: "Your health information is kept private and secure. We don't store your data."
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
            <span className="font-medium text-foreground">Important:</span> MediAssist AI provides general health information for educational purposes. 
            It's not a substitute for professional medical advice. Always consult with a healthcare provider.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoSection;
