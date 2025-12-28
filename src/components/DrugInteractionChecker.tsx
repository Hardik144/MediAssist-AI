import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pill, AlertCircle, Check, X, Plus } from "lucide-react";
import { checkDrugInteractions, DrugInteraction } from "@/services/healthAIService";
import LoadingAnimation from "./LoadingAnimation";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DrugInteractionChecker = () => {
  const [medications, setMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);

  const handleAddMedication = () => {
    if (!newMedication.trim()) {
      toast.error("Please enter a medication name");
      return;
    }

    if (medications.includes(newMedication.trim())) {
      toast.error("This medication is already in your list");
      return;
    }

    setMedications([...medications, newMedication.trim()]);
    setNewMedication("");
    toast.success(`Added ${newMedication} to your list`);
  };

  const handleRemoveMedication = (med: string) => {
    setMedications(medications.filter(m => m !== med));
    toast.info(`Removed ${med} from your list`);
  };

  const handleCheckInteractions = async () => {
    if (medications.length < 2) {
      toast.error("Please add at least two medications to check for interactions");
      return;
    }

    setIsLoading(true);
    setInteractions([]);

    try {
      const interactionData = await checkDrugInteractions(medications);
      setInteractions(interactionData);
      
      // Count severe interactions
      const severeCount = interactionData.filter(
        (interaction) => interaction.severity === "severe"
      ).length;
      
      if (severeCount > 0) {
        toast.error(`Found ${severeCount} severe drug interactions!`);
      } else {
        toast.success("Interaction check completed");
      }
    } catch (error) {
      console.error("Error checking interactions:", error);
      toast.error(error instanceof Error ? error.message : "Failed to check drug interactions");
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-destructive/10 border-destructive text-destructive";
      case "moderate":
        return "bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-400";
      case "mild":
        return "bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400";
      case "none":
        return "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "severe":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "moderate":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "mild":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "none":
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-6 w-6" />
            <span>Drug Interaction Checker</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Your Medications</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add the medications you're taking to check for potential interactions.
              </p>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter medication name..."
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  className="flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMedication();
                    }
                  }}
                />
                <Button onClick={handleAddMedication}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {medications.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {medications.map((med) => (
                    <Badge key={med} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                      <span>{med}</span>
                      <button 
                        onClick={() => handleRemoveMedication(med)}
                        className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No medications added yet.</p>
              )}
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleCheckInteractions} 
                  disabled={medications.length < 2 || isLoading}
                >
                  Check Interactions
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <LoadingAnimation />
                <p className="mt-4 text-sm text-muted-foreground">Analyzing drug interactions...</p>
              </div>
            ) : interactions.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4 text-foreground">Interaction Results</h3>
                <div className="space-y-4">
                  {interactions.map((interaction, index) => (
                    <Card 
                      key={index} 
                      className={`border-l-4 ${getSeverityColor(interaction.severity)}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getSeverityIcon(interaction.severity)}
                              <h4 className="font-semibold text-foreground">
                                {interaction.drug1} + {interaction.drug2}
                              </h4>
                            </div>
                            <p className="text-sm text-foreground mb-2">{interaction.description}</p>
                            <p className="text-sm font-medium text-foreground">Recommendation:</p>
                            <p className="text-sm text-muted-foreground">{interaction.recommendation}</p>
                          </div>
                          <Badge 
                            variant={interaction.severity === "none" ? "outline" : "destructive"}
                            className="capitalize"
                          >
                            {interaction.severity}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}
            
            <Alert className="bg-primary/5 border-primary/20">
              <AlertCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="text-foreground">Important Disclaimer</AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground">
                This tool provides information for educational purposes only. Always consult with a healthcare 
                professional before making any changes to your medication regimen. Never stop taking prescribed 
                medication without medical advice.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DrugInteractionChecker;
