# MediAssist AI 🩺

MediAssist AI is an AI-powered disease and medicine recommendation system that helps users understand their symptoms and get medical advice based on them. The system provides disease predictions, recommended medicines, alternative medicines, side effects, dosage details, precautions, home remedies, lifestyle tips, and when to consult a doctor.

## 🌟 Features

- **Disease Prediction:** Based on user-reported symptoms, the system predicts the possible disease or condition.
- **Recommended Medicine:** The system recommends medicines based on the detected disease.
- **Alternative Medicines:** Suggestions for alternative treatments.
- **Dosage and Precautions:** Provides information on the recommended dosage and necessary precautions.
- **Side Effects:** Lists the common side effects of the prescribed medicines.
- **Home Remedies:** Offers potential home remedies based on the symptoms.
- **Lifestyle Tips:** Suggests healthy lifestyle habits to manage or alleviate symptoms.
- **When to Consult a Doctor:** Advises on when the user should seek professional medical attention.

## 🛠️ Technology Stack

- **Frontend:**
  - HTML
  - CSS
  - JavaScript
- **Backend:**
  - Flask (Python)
- **AI/ML Model:** Uses the **Gemini-1.5-Flash** model from Google's Gemini API to generate medical responses based on user symptoms.

## 📋 Setup Instructions

### Prerequisites
Make sure you have the following installed:
- Python 3.x
- pip (Python package installer)
- A Gemini API key (from Google)

### Step 1: Clone the Repository
Clone this repository to your local machine using the following command:
```bash
git clone https://github.com/Hardik144/MediAssist-AI.git
```

### Step 2: Set Up Virtual Environment
Navigate to the project folder:
```bash
cd MediAssist-AI
```

Create a virtual environment:
```bash
python -m venv venv
```

Activate the virtual environment:

On Windows:
```bash
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

### Step 3: Install Dependencies
Install the required Python packages:
```bash
pip install -r requirements.txt
```

### Step 4: Set Up Environment Variables
Create a `.env` file in the root of the project folder and add your API keys:
```env
GEMINI_API_KEY=your_api_key_here
```

### Step 5: Run the Application
Start the Flask server:
```bash
python app.py
```

Visit the application in your browser at `http://127.0.0.1:5000/`.

## 🧠 AI Model: Gemini-1.5-Flash

MediAssist AI uses the Gemini-1.5-Flash model, a state-of-the-art language model by Google, to process user symptoms and provide medical advice. This model is configured using the Gemini API to generate structured responses with disease predictions, recommended medicines, and more.

## 📊 API Response Format

When you input symptoms into the system, the backend generates a response in the following format:

```json
{
  "Disease": "Common Cold",
  "Recommended Medicine": "Paracetamol",
  "Alternative Medicines": ["Ibuprofen", "Aspirin"],
  "Dosage": "Take 500mg every 4-6 hours.",
  "Precautions": "Do not exceed 4 doses in 24 hours.",
  "Side Effects": ["Drowsiness", "Stomach upset"],
  "When to Consult a Doctor": "If symptoms persist for more than 5 days or worsen.",
  "Home Remedies": ["Drink warm fluids", "Rest in a comfortable environment"],
  "Symptom Description": "Feeling of congestion, sore throat, and runny nose.",
  "Lifestyle Tips": ["Stay hydrated", "Avoid smoking or exposure to irritants"],
  "Disclaimer": "This information is for educational purposes only and not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment."
}
```

## 📁 Project Structure

```
MediAssist-AI/
├── app.py                  # Main Flask application
├── requirements.txt        # Project dependencies
├── .env                    # Environment variables (not tracked by git)
└── templates/              # HTML templates
    └── index.html          # include both css and js code
```

## 🚀 Detailed Setup Tutorial

### Step 1: Clone the Repository
```bash
git clone https://github.com/Hardik144/MediAssist-AI.git
cd MediAssist-AI
```

### Step 2: Set Up Virtual Environment
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Create Environment File
Create a `.env` file in the project root with your API key:
```env
GEMINI_API_KEY=your_api_key_here
```

### Step 5: Run the Application
```bash
python app.py
```
Access the application at `http://127.0.0.1:5000/`

## 📝 Example `requirements.txt`
```
Flask==2.1.2
google-generativeai==0.6.1
python-dotenv==0.19.2
```

## 🤝 Contributing

Feel free to fork the repository and create pull requests. We welcome any contributions that help improve the functionality, design, or user experience of the system.

## ⚠️ Disclaimer

This application is for educational purposes only and is not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis and treatment.

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For any questions or feedback, please reach out to the project maintainers.
