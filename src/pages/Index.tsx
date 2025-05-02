
import React, { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SymptomForm from "@/components/SymptomForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import LoadingAnimation from "@/components/LoadingAnimation";
import Header from "@/components/Header";
import TrendingSymptoms from "@/components/TrendingSymptoms";
import InfoSection from "@/components/InfoSection";
import MedicalResourcesSection from "@/components/MedicalResourcesSection";
import HealthTips from "@/components/HealthTips";
import GeminiHealthAdvisor from "@/components/GeminiHealthAdvisor";
import { Heart, Stethoscope, ClipboardList, History, Brain } from "lucide-react";
import { useSymptomHistory } from "@/hooks/use-symptom-history";
import MedicationReminders from "@/components/MedicationReminders";
import SymptomHistory from "@/components/SymptomHistory";

// Mock processed results for demonstration
const mockResults = {
  "Common Cold": {
    "Disease": "Common Cold",
    "Recommended Medicine": "Acetaminophen (e.g., Tylenol)",
    "Alternative Medicines": ["Ibuprofen (e.g., Advil)", "Nasal decongestants", "Cough suppressants"],
    "Dosage": "Adults: 325-650 mg every 4-6 hours as needed. Don't exceed 3,000 mg in 24 hours.",
    "Precautions": "Avoid alcohol consumption while taking acetaminophen. Not recommended for those with liver disease.",
    "Side Effects": ["Nausea", "Stomach pain", "Headache", "Dizziness"],
    "When to Consult a Doctor": "If symptoms persist for more than 10 days, if you develop a high fever (over 101.3°F or 38.5°C), or if you experience severe throat pain, ear pain, or sinus pain.",
    "Home Remedies": ["Rest and stay hydrated", "Gargle with salt water for sore throat", "Use a humidifier", "Honey and warm lemon water for cough"],
    "Symptom Description": "Common cold symptoms typically include runny or stuffy nose, sneezing, sore throat, mild cough, and sometimes a low-grade fever. These symptoms usually develop 1-3 days after exposure to the virus and can last 7-10 days.",
    "Lifestyle Tips": ["Wash hands frequently", "Get adequate sleep (7-8 hours)", "Stay hydrated", "Eat vitamin C rich foods"],
    "Disclaimer": "This information is for educational purposes only and not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment."
  },
  "Influenza": {
    "Disease": "Influenza (Flu)",
    "Recommended Medicine": "Oseltamivir (Tamiflu)",
    "Alternative Medicines": ["Zanamivir (Relenza)", "Baloxavir marboxil (Xofluza)", "Acetaminophen for fever"],
    "Dosage": "Oseltamivir: 75mg twice daily for 5 days. Most effective when started within 48 hours of symptom onset.",
    "Precautions": "People with asthma should use caution with zanamivir. Antiviral resistance can develop. Not recommended for those with certain underlying conditions without medical supervision.",
    "Side Effects": ["Nausea", "Vomiting", "Headache", "Dizziness", "Insomnia"],
    "When to Consult a Doctor": "If you have difficulty breathing, chest pain, persistent high fever, or if you're in a high-risk group (elderly, pregnant, young children, immunocompromised).",
    "Home Remedies": ["Rest and stay hydrated", "Use a humidifier", "Warm saltwater gargle for sore throat", "Warm broth soups"],
    "Symptom Description": "Influenza comes on suddenly with fever, chills, muscle aches, headache, fatigue, cough, and sometimes sore throat and runny nose. Symptoms are typically more severe than a cold and can last 1-2 weeks.",
    "Lifestyle Tips": ["Get annual flu vaccination", "Wash hands frequently", "Avoid contact with sick individuals", "Get plenty of sleep"],
    "Disclaimer": "This information is for educational purposes only and not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment."
  },
  "Migraine": {
    "Disease": "Migraine Headache",
    "Recommended Medicine": "Sumatriptan (Imitrex)",
    "Alternative Medicines": ["Ibuprofen", "Rizatriptan (Maxalt)", "Topiramate (preventative)"],
    "Dosage": "Sumatriptan: 50-100mg at onset of migraine. May repeat after 2 hours if needed. Don't exceed 200mg in 24 hours.",
    "Precautions": "Triptans should not be used by people with certain heart conditions, history of stroke, or uncontrolled high blood pressure. Not to be taken with certain antidepressants.",
    "Side Effects": ["Dizziness", "Fatigue", "Tightness in chest or throat", "Tingling sensations", "Nausea"],
    "When to Consult a Doctor": "If you experience the 'worst headache of your life,' headache with fever, confusion, stiff neck, or headaches that worsen over time.",
    "Home Remedies": ["Rest in a dark, quiet room", "Apply cold or warm compress to head", "Caffeine (in moderation)", "Stay hydrated"],
    "Symptom Description": "Migraines typically present as throbbing pain on one side of the head, often with nausea, sensitivity to light and sound, and sometimes visual disturbances (aura). Episodes can last 4-72 hours.",
    "Lifestyle Tips": ["Identify and avoid triggers", "Maintain regular sleep schedule", "Stay hydrated", "Practice stress management techniques"],
    "Disclaimer": "This information is for educational purposes only and not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment."
  },
  "Joint Pain": {
    "Disease": "Osteoarthritis",
    "Recommended Medicine": "Naproxen (Aleve)",
    "Alternative Medicines": ["Ibuprofen (Advil)", "Acetaminophen (Tylenol)", "Topical diclofenac gel"],
    "Dosage": "Naproxen: 220-440mg twice daily with food. Don't exceed 660mg in 24 hours for over-the-counter use.",
    "Precautions": "NSAIDs like naproxen can cause stomach ulcers and bleeding. Not recommended for long-term use without medical supervision, especially in older adults or those with kidney issues.",
    "Side Effects": ["Stomach pain", "Heartburn", "Nausea", "Dizziness", "Increased blood pressure"],
    "When to Consult a Doctor": "If you experience sudden, severe joint pain, significant swelling, joint deformity, inability to move the joint, or if pain persists for more than a few weeks.",
    "Home Remedies": ["RICE method (Rest, Ice, Compression, Elevation)", "Warm compresses", "Epsom salt baths", "Gentle stretching"],
    "Symptom Description": "Osteoarthritis causes joint pain, stiffness (especially in the morning), reduced range of motion, and sometimes swelling. Pain typically worsens with activity and improves with rest.",
    "Lifestyle Tips": ["Maintain healthy weight", "Low-impact exercise", "Use proper body mechanics", "Consider supportive devices like braces"],
    "Disclaimer": "This information is for educational purposes only and not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment."
  },
  "Upset Stomach": {
    "Disease": "Gastroenteritis",
    "Recommended Medicine": "Bismuth subsalicylate (Pepto-Bismol)",
    "Alternative Medicines": ["Loperamide (Imodium) for diarrhea", "Oral rehydration solutions", "Probiotics"],
    "Dosage": "Bismuth subsalicylate: Adults and children 12+ years: 30 mL or 2 tablets every 30-60 minutes as needed, up to 8 doses in 24 hours.",
    "Precautions": "Not recommended for those taking blood thinners, aspirin, or with aspirin allergies. May cause temporary darkening of tongue and stool.",
    "Side Effects": ["Constipation", "Black stool", "Temporary darkening of tongue", "Ringing in the ears (with high doses)"],
    "When to Consult a Doctor": "If symptoms persist beyond 2 days, if you have severe abdominal pain, high fever, bloody stools, or signs of dehydration (extreme thirst, dark urine, dizziness).",
    "Home Remedies": ["Stay hydrated with clear fluids", "BRAT diet (Bananas, Rice, Applesauce, Toast)", "Ginger tea", "Avoid dairy, caffeine, and spicy foods"],
    "Symptom Description": "Gastroenteritis typically causes diarrhea, nausea, vomiting, abdominal cramps, and sometimes fever or headache. Symptoms usually last 1-3 days but can persist longer.",
    "Lifestyle Tips": ["Wash hands frequently", "Practice food safety", "Stay hydrated", "Ease back into normal diet slowly"],
    "Disclaimer": "This information is for educational purposes only and not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment."
  },
  "Rash": {
    "Disease": "Contact Dermatitis",
    "Recommended Medicine": "Hydrocortisone cream (1%)",
    "Alternative Medicines": ["Calamine lotion", "Oral antihistamines (e.g., Benadryl)", "Colloidal oatmeal baths"],
    "Dosage": "Apply hydrocortisone cream to affected areas up to 3-4 times daily for no more than 7 days.",
    "Precautions": "Avoid using on broken skin, face, or genital areas without medical advice. Prolonged use can thin skin.",
    "Side Effects": ["Skin thinning (with prolonged use)", "Skin irritation", "Changes in skin color", "Increased hair growth in treated area"],
    "When to Consult a Doctor": "If the rash covers a large area, is severely painful, blisters, spreads rapidly, or is accompanied by fever, difficulty breathing, or facial/oral swelling.",
    "Home Remedies": ["Cool compresses", "Warm colloidal oatmeal baths", "Avoid scratching", "Wear loose, cotton clothing"],
    "Symptom Description": "Contact dermatitis causes red, itchy skin where contact with an irritant or allergen occurred. The rash may be bumpy, scaly, or include blisters, and typically appears within hours or days of exposure.",
    "Lifestyle Tips": ["Identify and avoid triggers", "Use mild, fragrance-free soaps", "Apply moisturizer regularly", "Wear protective gloves when handling potential irritants"],
    "Disclaimer": "This information is for educational purposes only and not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment."
  }
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("symptoms");
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { addSymptom, history } = useSymptomHistory();

  const handleSymptomSubmit = async (symptoms: string) => {
    if (symptoms.trim().length < 3) {
      toast.error("Please enter valid symptoms (at least 3 characters)");
      return;
    }

    setIsLoading(true);
    
    // Determine which results to show based on symptom keywords
    setTimeout(() => {
      let resultKey = "Common Cold"; // Default
      
      const symptomLower = symptoms.toLowerCase();
      
      if (symptomLower.includes("headache") && (symptomLower.includes("migraine") || symptomLower.includes("severe"))) {
        resultKey = "Migraine";
      } else if (symptomLower.includes("fever") && (symptomLower.includes("body ache") || symptomLower.includes("flu"))) {
        resultKey = "Influenza";
      } else if (symptomLower.includes("joint") || symptomLower.includes("arthritis") || symptomLower.includes("swelling")) {
        resultKey = "Joint Pain";
      } else if (symptomLower.includes("stomach") || symptomLower.includes("nausea") || symptomLower.includes("vomit")) {
        resultKey = "Upset Stomach";
      } else if (symptomLower.includes("rash") || symptomLower.includes("itch") || symptomLower.includes("skin")) {
        resultKey = "Rash";
      } else if (symptomLower.includes("cold") || symptomLower.includes("cough") || symptomLower.includes("sore throat")) {
        resultKey = "Common Cold";
      }
      
      const newResults = mockResults[resultKey];
      setResults(newResults);
      setIsLoading(false);
      setCurrentTab("results");
      
      // Add to symptom history
      addSymptom(symptoms, newResults);
      
      toast.success("Analysis complete!");
    }, 3000);
  };

  const handleReminders = () => {
    setRemindersOpen(true);
  };

  const handleHistory = () => {
    setHistoryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container px-4 py-8">
        <Tabs 
          value={currentTab} 
          onValueChange={setCurrentTab}
          className="w-full max-w-4xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span>Check Symptoms</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2" disabled={!results && !isLoading}>
              <ClipboardList className="h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
            <TabsTrigger value="ai-advisor" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>AI Advisor</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Health Resources</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleHistory}
            >
              <History className="h-4 w-4" />
              <span>Symptom History</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleReminders}
            >
              <History className="h-4 w-4" />
              <span>Medication Reminders</span>
            </Button>
          </div>
          
          <TabsContent value="symptoms" className="space-y-8">
            <Card className="medical-card p-6 bg-white shadow-lg">
              <SymptomForm onSubmit={handleSymptomSubmit} />
            </Card>
            
            <TrendingSymptoms onSelect={(symptom) => {
              // Auto-fill the form and trigger search
              handleSymptomSubmit(symptom);
            }} />
            
            <InfoSection />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-8">
            {isLoading ? (
              <LoadingAnimation />
            ) : results ? (
              <ResultsDisplay results={results} />
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">No results to display yet. Check your symptoms first.</p>
                <Button 
                  onClick={() => setCurrentTab("symptoms")} 
                  variant="link"
                  className="mt-2"
                >
                  Go to symptom checker
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-advisor" className="space-y-8">
            <GeminiHealthAdvisor />
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-8">
            <MedicalResourcesSection />
            <HealthTips />
          </TabsContent>
        </Tabs>
      </main>
      
      <MedicationReminders
        isOpen={remindersOpen}
        onClose={() => setRemindersOpen(false)}
        recommendedMedicine={results?.["Recommended Medicine"] || ""}
      />

      <SymptomHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectSymptom={(symptom) => {
          handleSymptomSubmit(symptom);
          setHistoryOpen(false);
        }}
      />
    </div>
  );
};

export default Index;
