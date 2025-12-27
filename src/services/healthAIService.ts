// Health AI Service - Uses Lovable Cloud backend
import { supabase } from "@/integrations/supabase/client";

export interface HealthAnalysisResult {
  Disease: string;
  "Recommended Medicine": string;
  "Alternative Medicines": string[];
  Dosage: string;
  Precautions: string;
  "Side Effects": string[];
  "When to Consult a Doctor": string;
  "Home Remedies": string[];
  "Symptom Description": string;
  "Lifestyle Tips": string[];
  Disclaimer: string;
}

export const analyzeSymptoms = async (
  symptoms: string, 
  language = 'english'
): Promise<HealthAnalysisResult> => {
  const { data, error } = await supabase.functions.invoke('health-ai', {
    body: { symptoms, type: 'analyze', language }
  });

  if (error) {
    console.error("Error analyzing symptoms:", error);
    throw new Error(error.message || "Failed to analyze symptoms");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
};

export const askHealthQuestion = async (question: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('health-ai', {
    body: { question, type: 'question' }
  });

  if (error) {
    console.error("Error asking question:", error);
    throw new Error(error.message || "Failed to get response");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
};

// Available languages for translation
export const availableLanguages = [
  { code: 'english', name: 'English' },
  { code: 'hindi', name: 'Hindi' },
  { code: 'tamil', name: 'Tamil' },
  { code: 'telugu', name: 'Telugu' },
  { code: 'marathi', name: 'Marathi' },
  { code: 'bengali', name: 'Bengali' },
  { code: 'gujarati', name: 'Gujarati' },
  { code: 'kannada', name: 'Kannada' },
  { code: 'malayalam', name: 'Malayalam' },
  { code: 'punjabi', name: 'Punjabi' }
];
