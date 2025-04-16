from flask import Flask, render_template, request
import google.generativeai as genai
import json
import re
import os
from datetime import datetime
import logging
import time
import random
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Get API key from environment variable or use the hard-coded one as fallback
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    logger.error("❌ GEMINI_API_KEY is not set in environment variables.")
    raise EnvironmentError("GEMINI_API_KEY not found in environment. Please set it in your .env file.")

# Configure Gemini
try:
    genai.configure(api_key=API_KEY)
    logger.info("Gemini API configured successfully")
except Exception as e:
    logger.error(f"Failed to configure Gemini API: {e}")

# Custom filter to break text after commas or full stops
@app.template_filter('breaklines')
def breaklines(value):
    if isinstance(value, str):
        return re.sub(r'(?<=[.,])\s*', '<br>', value)
    return value

# Prompt template
def generate_prompt(symptoms):
    return f"""
You are a highly knowledgeable and reliable AI medical assistant. Your role is to provide general health-related guidance and suggestions for informational and educational purposes based on user-reported symptoms.

Based on the following symptoms: "{symptoms}", generate a helpful and structured medical summary in valid JSON format.

⚠️ Always provide an answer — do not defer by saying "I cannot provide that" or "consult a doctor." If unsure, offer a likely or commonly associated response based on general medical knowledge. Assume the goal is to give helpful, non-critical advice, and include typical suggestions known from reliable health sources.

Ensure the response follows this exact JSON format (use double quotes, no trailing commas, no markdown formatting):

{{
  "Disease": "",
  "Recommended Medicine": "",
  "Alternative Medicines": [],
  "Dosage": "",
  "Precautions": "",
  "Side Effects": [],
  "When to Consult a Doctor": "",
  "Home Remedies": [],
  "Symptom Description": "",
  "Lifestyle Tips": [],
  "Disclaimer": "This information is for educational purposes only and not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment."
}}
🎯 Important Instructions:

1. Always respond in pure JSON, no additional explanations or formatting.
2. Use realistic, non-exaggerated values based on commonly available over-the-counter medications or natural remedies.
3. If multiple possibilities exist for a symptom, choose the most probable condition.
4. All list fields like "Alternative Medicines", "Side Effects", "Home Remedies", and "Lifestyle Tips" must return an array of strings.
5. Never return empty or null values — if no specific info is known, provide general suggestions.
"""

# Try to extract and validate JSON from the model's response
def extract_json(response_text):
    try:
        # Look for JSON pattern in the response
        json_pattern = r'({[\s\S]*})'
        matches = re.search(json_pattern, response_text)
        
        if matches:
            json_str = matches.group(1)
            return json.loads(json_str)
        else:
            # Fall back to basic extraction
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            if start >= 0 and end > start:
                json_str = response_text[start:end]
                return json.loads(json_str)
            else:
                logger.error("No JSON found in the response")
                return None
                
    except Exception as e:
        logger.error(f"Error parsing JSON: {e}")
        return None

# Add artificial delay if needed for better UX with the loading animation
def add_processing_delay():
    # Add a small random delay between 0.5 and 1.5 seconds for better UX
    # This helps ensure the loading animation is visible even with fast responses
    # Only use this in development, remove in production
    if app.debug:
        delay = random.uniform(0.5, 1.5)
        time.sleep(delay)
        logger.debug(f"Added artificial delay of {delay:.2f} seconds")

@app.route('/', methods=['GET', 'POST'])
def home():
    ai_response = None
    error = None

    if request.method == 'POST':
        symptoms = request.form.get('symptom')
        
        if not symptoms or len(symptoms.strip()) < 3:
            error = "Please enter a valid symptom description (at least 3 characters)"
            return render_template('index.html', result=None, error=error)

        try:
            start_time = datetime.now()
            logger.info(f"Processing request for symptoms: {symptoms}")
            
            # Add artificial delay to make loading animation more visible if needed
            # add_processing_delay()
            
            model = genai.GenerativeModel('gemini-1.5-flash')  # or 'gemini-pro'
            prompt = generate_prompt(symptoms)
            
            response = model.generate_content(prompt)
            raw_content = response.text.strip()
            
            # Log response but truncate if too long
            log_content = raw_content[:500] + "..." if len(raw_content) > 500 else raw_content
            logger.info(f"Received AI response: {log_content}")

            ai_response = extract_json(raw_content)
            
            if not ai_response:
                error = "Unable to process the AI response. Please try again or rephrase your symptoms."
                logger.error("Failed to extract JSON from AI response")
            else:
                # Ensure all list fields are actually lists
                list_fields = ['Alternative Medicines', 'Side Effects', 'Home Remedies', 'Lifestyle Tips']
                for field in list_fields:
                    if field in ai_response and not isinstance(ai_response[field], list):
                        if ai_response[field]:  # If it has a non-empty value
                            ai_response[field] = [ai_response[field]]  # Convert to list
                        else:
                            ai_response[field] = []  # Ensure empty list
                
                # Add artificial delay to make loading animation more visible if needed
                # add_processing_delay()
                
                logger.info(f"Successfully processed response in {(datetime.now() - start_time).total_seconds():.2f} seconds")

        except Exception as e:
            error = f"An error occurred while processing your request. Please try again."
            logger.error(f"Exception during processing: {str(e)}")

    return render_template('index.html', result=ai_response, error=error)

if __name__ == '__main__':
    app.run(debug=True, port=5001)