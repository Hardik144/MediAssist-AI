
// This is a service for interacting with Google Gemini AI

// In a real app, this key should be stored securely
// For demo purposes, we're using a placeholder
// This requires a valid API key from Google Gemini
let apiKey = '';

export const setGeminiApiKey = (key: string) => {
  apiKey = key;
};

export const getGeminiApiKey = () => {
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
          Authorization: `Bearer ${apiKey}`,
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
