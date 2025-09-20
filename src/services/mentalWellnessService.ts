// Mental Wellness AI Service for Youth Support

// For frontend applications, we need to access environment variables differently
// Vite uses import.meta.env, Create-React-App uses process.env with REACT_APP_ prefix
const getEnvApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // Vite
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  } else if (typeof process !== 'undefined' && process.env) {
    // Node.js or Create-React-App
    return process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  }
  return '';
};

// Initialize API key from environment variables or localStorage fallback
let apiKey = getEnvApiKey();

export const setMentalWellnessApiKey = (key: string) => {
  apiKey = key;
  // We'll still save to localStorage as a fallback for browsers
  localStorage.setItem('mentalWellnessApiKey', key);
};

export const getMentalWellnessApiKey = () => {
  // If we already have an apiKey in memory, return it
  if (apiKey) {
    return apiKey;
  }
  
  // Try to get the API key from environment variables again
  apiKey = getEnvApiKey();
  
  // If still not available, try localStorage as a fallback
  if (!apiKey) {
    apiKey = localStorage.getItem('mentalWellnessApiKey') || '';
  }
  
  return apiKey;
};

export const getMentalWellnessSupport = async (prompt: string): Promise<string> => {
  const key = getMentalWellnessApiKey();
  if (!key) {
    return "Please set your API key to access personalized mental wellness support.";
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a compassionate, empathetic AI mental wellness companion specifically designed to support young people (teens and young adults). Your role is to provide emotional support, validate feelings, and offer practical coping strategies while maintaining appropriate boundaries.

Guidelines for responses:
- Use warm, non-judgmental, and age-appropriate language
- Validate their feelings and normalize their experiences
- Focus on resilience, hope, and strength-based approaches
- Provide practical, actionable coping strategies
- Encourage professional help when appropriate
- Never provide diagnosis or treatment recommendations
- Always emphasize confidentiality and safety
- Be aware of crisis situations and provide appropriate resources

If someone expresses thoughts of self-harm or suicide, prioritize their safety and provide crisis resources immediately.

User's message: ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
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
      return "I'm here to listen and support you. Please feel free to share more about how you're feeling.";
    }
  } catch (error) {
    console.error("Error querying Mental Wellness API:", error);
    return "I'm having trouble connecting right now, but I'm here for you. Please try again in a moment.";
  }
};

// Function to get structured mental wellness guidance
export const getPersonalizedWellnessGuidance = async (
  feelings: string, 
  moodLevel: string, 
  additionalContext: string = '',
  language = 'english'
) => {
  const key = getMentalWellnessApiKey();
  if (!key) {
    throw new Error("Please set your API key to access personalized mental wellness support.");
  }

  try {
    const prompt = `You are a mental wellness AI specifically designed to support young people. Based on the following information, provide structured guidance in JSON format:

    Feelings/Concerns: "${feelings}"
    Current Mood Level: "${moodLevel}"
    Additional Context: "${additionalContext}"
    
    Provide a JSON response with these exact keys:
    
    {
      "moodLevel": "${moodLevel}",
      "feelings": "${feelings}",
      "AI Response": "A compassionate, empathetic response that validates their feelings and provides emotional support (2-3 paragraphs)",
      "Recommended Actions": ["List of 3-4 immediate practical actions they can take"],
      "Coping Strategies": ["List of 4-5 healthy coping strategies suitable for young people"],
      "When to Seek Help": "Guidance on when to reach out to trusted adults, counselors, or crisis resources",
      "Affirmations": ["List of 3-4 positive affirmations"],
      "Crisis Assessment": "low/medium/high - assess if they need immediate crisis support",
      "Disclaimer": "Appropriate disclaimer about AI support and professional help"
    }
    
    Important guidelines:
    - Use warm, youth-friendly language
    - Validate their feelings without minimizing them
    - Focus on hope, resilience, and their strengths
    - Provide practical, age-appropriate suggestions
    - Be sensitive to potential mental health struggles
    - If mood is "very-low" or signs of crisis, emphasize immediate support resources
    
    IMPORTANT: Return ONLY valid JSON with these exact keys.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
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
            temperature: 0.3,
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
        
        // Ensure we have the essential fields
        if (!parsedResult.moodLevel) parsedResult.moodLevel = moodLevel;
        if (!parsedResult.feelings) parsedResult.feelings = feelings;
        
        return parsedResult;
      } catch (parseError) {
        console.error("Error parsing Mental Wellness response as JSON:", parseError);
        // Return a fallback response
        return {
          moodLevel: moodLevel,
          feelings: feelings,
          "AI Response": "Thank you for sharing your feelings with me. Your emotions are completely valid, and it takes courage to reach out for support. Remember that you're not alone in what you're experiencing - many young people face similar challenges. I'm here to help you work through this together.",
          "Recommended Actions": [
            "Take slow, deep breaths to help center yourself",
            "Reach out to a trusted friend or family member",
            "Write down your thoughts and feelings in a journal",
            "Engage in a calming activity you enjoy"
          ],
          "Coping Strategies": [
            "Practice mindfulness or meditation for a few minutes",
            "Go for a walk or do light exercise",
            "Listen to music that helps you feel better",
            "Practice the 5-4-3-2-1 grounding technique",
            "Talk to someone you trust about your feelings"
          ],
          "When to Seek Help": "If your feelings become overwhelming, persist for several days, or if you have thoughts of self-harm, please reach out to a trusted adult, school counselor, or mental health professional.",
          "Affirmations": [
            "My feelings are valid and temporary",
            "I have the strength to get through difficult times",
            "I deserve support and care",
            "It's okay to ask for help"
          ],
          "Crisis Assessment": moodLevel === 'very-low' ? 'medium' : 'low',
          "Disclaimer": "This AI support is designed to provide emotional guidance and is not a replacement for professional mental health care."
        };
      }
    } else {
      throw new Error("No valid response generated");
    }
  } catch (error) {
    console.error("Error getting personalized wellness guidance:", error);
    throw error;
  }
};

// Crisis resources for immediate help
export const crisisResources = [
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    description: "Free, 24/7 crisis support via text",
    available: "24/7"
  },
  {
    name: "National Suicide Prevention Lifeline", 
    contact: "988 or 1-800-273-8255",
    description: "24/7 suicide prevention and crisis support",
    available: "24/7"
  },
  {
    name: "Teen Line",
    contact: "1-800-852-8336 or text TEEN to 839863",
    description: "Teens helping teens with peer support",
    available: "6pm-10pm PT daily"
  },
  {
    name: "LGBT National Hotline",
    contact: "1-888-843-4564",
    description: "Support for LGBTQ+ youth and young adults", 
    available: "Mon-Fri 4pm-12am ET, Sat 12pm-5pm ET"
  },
  {
    name: "National Eating Disorders Association",
    contact: "1-800-931-2237",
    description: "Support for eating disorders and body image concerns",
    available: "Mon-Thu 11am-9pm ET, Fri 11am-5pm ET"
  }
];

// Available languages for translation
export const availableLanguages = [
  { code: 'english', name: 'English' },
  { code: 'spanish', name: 'Spanish' },
  { code: 'french', name: 'French' },
  { code: 'german', name: 'German' },
  { code: 'italian', name: 'Italian' },
  { code: 'portuguese', name: 'Portuguese' },
  { code: 'chinese', name: 'Chinese' },
  { code: 'japanese', name: 'Japanese' },
  { code: 'korean', name: 'Korean' }
];