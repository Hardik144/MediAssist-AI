# MediAssist-AI

MediAssist-AI is a web-based assistant that helps users get quick, AI-powered medical information and assistance. It combines a modern frontend, a lightweight backend (Supabase), and AI model integrations to provide symptom explanations, medication information, and general health guidance. This repository contains the frontend application, Supabase integration helpers, and configuration to run locally or deploy.

> IMPORTANT: MediAssist-AI is an informational tool only. It does NOT provide medical diagnoses. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment. Do NOT use this project as a substitute for professional medical advice.

Table of contents
- Features
- Tech stack
- Project structure
- Quick start
- Environment variables
- Scripts
- Deployment
- Security & privacy
- Contributing
- License

Features
- AI-powered assistance for symptoms, medications, and general medical questions (requires AI API key).
- Supabase used for lightweight persistence (user sessions, logs, or application data).
- Responsive web UI built with Vite + TypeScript + Tailwind CSS.
- Environment-driven configuration for API keys and endpoints.

Tech stack
- Vite (build tool)
- TypeScript
- Tailwind CSS
- Supabase (backend/database/auth)
- AI provider (configure via environment variable, e.g. OpenAI)

Project structure
- public/ — static assets
- src/ — frontend source code
- supabase/ — Supabase helper files and SQL (migrations, table definitions)
- README.md — this file
- .env — local environment variable template (DO NOT commit secrets)
- package.json — npm scripts and dependencies

Quick start (local)
1. Clone the repo
   git clone https://github.com/Hardik144/MediAssist-AI.git
   cd MediAssist-AI

2. Install dependencies
   npm install

3. Create a .env file at the project root (see Environment variables below). Copy the existing .env if present.

4. Run the dev server
   npm run dev

5. Open the app in your browser (usually http://localhost:5173)

Environment variables
Create a .env file and add the following (names are examples — match the keys used in the code):
- VITE_SUPABASE_URL=your-supabase-url
- VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
- OPENAI_API_KEY=your-openai-api-key (or other AI provider key)
- NEXT_PUBLIC_SUPABASE_URL (if used by the code)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (if used by the code)

Notes:
- Never commit secrets or API keys to Git. Use environment variables or a secret manager.
- If this repo uses a different variable naming convention, update the .env keys accordingly.

Scripts (common)
- npm run dev — start development server
- npm run build — build for production
- npm run preview — locally preview production build
- npm test — run tests (if available)

Deployment
- Build for production using `npm run build` and deploy the output directory via your hosting provider (Vercel, Netlify, static host, or a Node server).
- If using Supabase, configure your production Supabase project and set the appropriate environment variables in your host provider.

Security & privacy
- This project may process sensitive health information. Take care to secure data in transit and at rest.
- Follow HIPAA or other applicable regulations when storing or transmitting personal health information.
- Review third-party AI provider policies and data usage terms.

Contributing
- Contributions and bug reports are welcome. Please open an issue first to discuss larger changes.
- Pull requests should include clear descriptions and, where appropriate, tests.

License
- Add your license here (e.g., MIT). If there is already a LICENSE file, mirror that here.

Contact
- Project: MediAssist-AI
- Maintainer: Hardik144 (GitHub)

---

If you'd like, I can:  
- run a quick scan of the code to pull exact dependency names and update the Tech stack section,  
- add usage examples/screenshots, or  
- create a PR instead of pushing directly to main.  

(Changes applied to README.md)
