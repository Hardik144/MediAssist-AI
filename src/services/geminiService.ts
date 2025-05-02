
// This is a service for interacting with Google Gemini AI

// In a real app, this key should be stored securely
// For demo purposes, we're using localStorage
let apiKey = '';

export const setGeminiApiKey = (key: string) => {
  apiKey = key;
  // Save to localStorage for persistence
  localStorage.setItem('geminiApiKey', key);
};

export const getGeminiApiKey = () => {
  // Try to get from memory first, then from localStorage
  if (!apiKey) {
    apiKey = localStorage.getItem('geminiApiKey') || '';
  }
  return apiKey;
};

export const askGemini = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    return "Please set your Google Gemini API key first.";
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,  // Changed from Authorization to x-goog-api-key
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful medical assistant AI. Provide informative, evidence-based answers about health topics. Include disclaimers when appropriate. Always encourage consulting healthcare professionals for medical advice.

Question: ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return `Error: ${data.error.message || "Failed to get response"}`;
    }
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "No response generated. Please try again.";
    }
  } catch (error) {
    console.error("Error querying Gemini API:", error);
    return "Error connecting to Gemini API. Please check your connection and try again.";
  }
};

// Function to get structured health information from Gemini
export const getHealthConditionInfo = async (symptoms: string) => {
  if (!apiKey) {
    throw new Error("Please set your Google Gemini API key first.");
  }

  try {
    const prompt = `Based on the following symptoms: "${symptoms}", provide a structured analysis in JSON format with the following keys:
    
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
    
    IMPORTANT: Return ONLY valid JSON with these exact keys. Do not add any additional text, and ensure it's properly formatted JSON.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,  // Changed from Authorization to x-goog-api-key
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Failed to get response");
    }
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const resultText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response (removing any markdown code blocks if present)
      const jsonMatch = resultText.match(/```json\s*([\s\S]*?)\s*```/) || 
                         resultText.match(/```\s*([\s\S]*?)\s*```/) || 
                         [null, resultText];
      
      const jsonStr = jsonMatch[1] || resultText;
      
      try {
        // Parse the JSON response
        const parsedResult = JSON.parse(jsonStr);
        return parsedResult;
      } catch (parseError) {
        console.error("Error parsing Gemini response as JSON:", parseError);
        throw new Error("Failed to parse health condition data");
      }
    } else {
      throw new Error("No valid response generated");
    }
  } catch (error) {
    console.error("Error getting health condition data:", error);
    throw error;
  }
};
