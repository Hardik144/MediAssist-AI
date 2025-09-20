import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Clock, Shield, Heart } from "lucide-react";
import { crisisResources } from "@/services/mentalWellnessService";

const CrisisSupport = () => {
  return (
    <Card className="w-full border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          <CardTitle className="text-red-800 text-lg md:text-xl">Crisis Support Resources</CardTitle>
        </div>
        <p className="text-sm text-red-700">
          If you're in crisis or having thoughts of self-harm, please reach out immediately. You're not alone.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {crisisResources.map((resource, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 text-sm md:text-base">{resource.name}</h4>
                <p className="text-xs md:text-sm text-red-600 mt-1">{resource.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500">{resource.available}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100 text-xs"
                  onClick={() => {
                    if (resource.contact.includes('741741')) {
                      // Text message
                      window.open(`sms:741741?body=HOME`, '_blank');
                    } else if (resource.contact.includes('988') || resource.contact.includes('1-800')) {
                      // Phone call
                      const phoneNumber = resource.contact.replace(/[^\d]/g, '');
                      window.open(`tel:${phoneNumber}`, '_blank');
                    }
                  }}
                >
                  {resource.contact.includes('text') || resource.contact.includes('741741') ? (
                    <MessageCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Phone className="h-3 w-3 mr-1" />
                  )}
                  Contact
                </Button>
                <p className="text-xs text-red-600 text-center">{resource.contact}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Heart className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-800 text-sm">Remember:</h5>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• You matter and your life has value</li>
                <li>• These feelings are temporary, even when they feel permanent</li>
                <li>• Seeking help is brave and shows strength</li>
                <li>• There are people who care about you and want to help</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrisisSupport;