
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const MedicalResourcesSection = () => {
  const resources = [
    {
      title: "CDC - Centers for Disease Control",
      description: "Official information on diseases, conditions, and public health",
      url: "https://www.cdc.gov/",
      category: "Official"
    },
    {
      title: "WHO - World Health Organization",
      description: "International public health guidance and information",
      url: "https://www.who.int/",
      category: "Official"
    },
    {
      title: "Mayo Clinic",
      description: "Comprehensive medical information from a trusted provider",
      url: "https://www.mayoclinic.org/",
      category: "Medical"
    },
    {
      title: "WebMD",
      description: "Health information, symptom checker, and medication guides",
      url: "https://www.webmd.com/",
      category: "Medical"
    },
    {
      title: "MedlinePlus",
      description: "Health information from the National Library of Medicine",
      url: "https://medlineplus.gov/",
      category: "Reference"
    },
    {
      title: "Healthline",
      description: "Health information and wellness advice",
      url: "https://www.healthline.com/",
      category: "Reference"
    }
  ];

  return (
    <Card className="medical-card mb-10">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground">Reliable Medical Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
              key={resource.title}
            >
              <div className="border border-border rounded-lg p-4 h-full hover:border-primary transition-colors bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {resource.category}
                  </span>
                </div>
                <div className="mt-4 text-xs text-primary flex items-center gap-1">
                  <span>Visit website</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
        
        {/* <div className="mt-6 text-center">
          <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
            View More Resources
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default MedicalResourcesSection;
