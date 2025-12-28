import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, type, question, language = 'english', healthInfo, targetLanguage, medications, medicineName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === 'analyze') {
      systemPrompt = `You are a helpful medical assistant AI. You provide informative, evidence-based health information. Always include appropriate disclaimers and encourage consulting healthcare professionals for medical advice.`;
      
      userPrompt = `Based on the following symptoms: "${symptoms}", provide a structured analysis in JSON format with the following keys:
      
      {
        "Disease": "Most likely health condition based on symptoms",
        "Recommended Medicine": "Primary recommended medication",
        "Alternative Medicines": ["List of alternative medications"],
        "Dosage": "Recommended dosage for primary medication",
        "Precautions": "Important precautions when using this medication",
        "Side Effects": ["Common side effects"],
        "When to Consult a Doctor": "Guidance on when medical attention is needed",
        "Home Remedies": ["Effective home remedies"],
        "Symptom Description": "Detailed description of typical symptoms",
        "Lifestyle Tips": ["Lifestyle recommendations"],
        "Disclaimer": "Medical disclaimer about the information provided"
      }
      
      ${language !== 'english' ? `Please provide all responses in ${language} language.` : ''}
      
      IMPORTANT: Return ONLY valid JSON with these exact keys. Do not add any additional text, and ensure it's properly formatted JSON.`;
    } else if (type === 'question') {
      systemPrompt = `You are a helpful medical assistant AI. Provide informative, evidence-based answers about health topics. Include disclaimers when appropriate. Always encourage consulting healthcare professionals for medical advice.`;
      userPrompt = question;
    } else if (type === 'translate') {
      systemPrompt = `You are a professional medical translator. Translate health information accurately while preserving medical terminology meaning.`;
      userPrompt = `Translate the following health information to ${targetLanguage}. Keep the exact same JSON structure but translate all values. Return ONLY valid JSON:

${JSON.stringify(healthInfo, null, 2)}

IMPORTANT: Return ONLY valid JSON with the same structure. Do not add any additional text.`;
    } else if (type === 'drug-interaction') {
      systemPrompt = `You are a clinical pharmacist AI assistant specializing in drug interactions. Provide accurate, evidence-based information about medication interactions. Always include appropriate safety warnings and encourage consultation with healthcare professionals.`;
      
      userPrompt = `Analyze potential drug interactions between these medications: ${medications.join(", ")}. 
      
      For each possible pair of drugs, provide information about potential interactions in this JSON format:
      
      [
        {
          "drug1": "Drug Name 1",
          "drug2": "Drug Name 2",
          "severity": "severe|moderate|mild|none",
          "description": "Description of the interaction and why it occurs",
          "recommendation": "Specific recommendation for the patient"
        }
      ]
      
      Consider all possible pairs. If there is no significant interaction between a pair, still include it with severity "none".
      
      IMPORTANT: Return ONLY valid JSON array with this exact structure. Do not add any explanations outside the JSON.`;
    } else if (type === 'medicine-info') {
      systemPrompt = `You are a pharmaceutical information AI assistant. Provide comprehensive, accurate medication information based on official drug databases and medical literature. Always include appropriate disclaimers.`;
      
      userPrompt = `Provide detailed information about the medicine: "${medicineName}". Return the information in this exact JSON format:
      
      {
        "name": "Full medication name (brand and generic if applicable)",
        "description": "Brief description of what this medication is and its drug class",
        "ingredients": ["Active ingredient 1", "Active ingredient 2"],
        "usedFor": ["Primary condition 1", "Primary condition 2", "Other uses"],
        "dosage": "Standard dosage information for adults",
        "sideEffects": ["Common side effect 1", "Common side effect 2", "Rare but serious effects"],
        "warnings": ["Important warning 1", "Contraindications", "Special populations warnings"],
        "interactions": ["Drug interaction 1", "Food interaction", "Other interactions"]
      }
      
      Provide accurate medical information based on standard pharmaceutical references.
      
      IMPORTANT: Return ONLY valid JSON with this exact structure. Do not add any additional text.`;
    } else {
      throw new Error("Invalid request type");
    }

    console.log(`Processing ${type} request`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI response received successfully");

    if (type === 'analyze' || type === 'translate' || type === 'drug-interaction' || type === 'medicine-info') {
      // Parse JSON from the response
      let jsonStr = content;
      
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      
      try {
        const parsedResult = JSON.parse(jsonStr);
        if (type === 'translate') {
          parsedResult.translatedLanguage = targetLanguage;
        }
        return new Response(JSON.stringify({ result: parsedResult }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        return new Response(JSON.stringify({ error: "Failed to parse response" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      return new Response(JSON.stringify({ result: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Health AI error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
