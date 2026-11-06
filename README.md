# Arogya Mitra — Your Health Report, Explained Like a Friend Would

Arogya Mitra translates confusing medical lab reports and prescriptions into calm, clear, kind language, and offers an **Ask a Specialist** health companion chatbot supporting 15 languages (English, Hindi, Bengali, Punjabi, Marathi, Gujarati, Kannada, Tamil, Telugu, Malayalam, Odia, Assamese, Bhojpuri, Rajasthani, and Sanskrit).

![Arogya Mitra Screenshot Placeholder](https://raw.githubusercontent.com/placeholder-media/screenshot-placeholder.png)

---

## What the App Does

- **Lab Report & Prescription Explainer**: Paste lab report text, prescription notes, or upload document photos/PDFs. Arogya Mitra breaks down complex clinical terms into easy-to-understand explanations with visual range bars and clarity scores.
- **Ask a Specialist Chatbot**: A gentle, personalized medical guide focusing on specialties such as General Physician, Cardiologist, Endocrinologist, Dermatologist, Neurologist, Gastroenterologist, Women's Health, Pediatrician, and Mental Wellbeing.
- **Multilingual Support (15 Languages)**: Complete translations for UI, explanations, and specialist chat across 15 Indian languages with native script typography.
- **Local Health Profile**: Secure, session-only context (name, age, sex, blood type, diabetes status, allergies, BP, existing conditions) for deeply tailored explanations.
- **Downloadable PDF & Doctor Questions**: Export clean, printer-friendly summary reports and actionable questions for your next doctor visit.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion), Lucide Icons, jsPDF
- **Backend**: Node.js 20+, Express, tsx
- **AI Engine**: Google Gemini API (`@google/genai`) via `gemini-3.1-flash-lite`
- **Build & Dev Tool**: Vite 8 with Rolldown chunk code-splitting

---

## Local Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd arogya-mitra
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key to `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Deployment (Two-Part Setup: Render Backend + GitHub Pages Frontend)

### Part 1: Deploy Backend to Render (Node Web Service)

1. Connect your repository to [Render](https://render.com/).
2. Create a new **Web Service** (or use the included `render.yaml` Blueprint) with the following settings:
   - **Environment**: Node
   - **Node Version**: `>=20.0.0`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/healthz`
3. Add the following **Environment Variables** in the Render service dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key (kept strictly secure on the server; never exposed to the frontend)
   - `ALLOWED_ORIGIN`: Your GitHub Pages origin URL (e.g. `https://<your-username>.github.io`) to allow secure cross-origin API calls
4. Once deployed, note your Render web service URL (e.g., `https://arogya-mitra.onrender.com`).

---

### Part 2: Deploy Frontend to GitHub Pages

1. In your GitHub repository, navigate to **Settings** → **Secrets and variables** → **Actions** → **Variables** tab.
2. Click **New repository variable** and add:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render service URL (e.g., `https://arogya-mitra.onrender.com`)
3. Go to **Settings** → **Pages** → **Build and deployment**:
   - Under **Source**, select **GitHub Actions**.
4. Push your changes to the `main` branch (or run the workflow manually via **Actions** → **Deploy Frontend to GitHub Pages** → **Run workflow**).
5. The GitHub Actions workflow (`.github/workflows/pages.yml`) will automatically:
   - Build the frontend bundle with `VITE_BASE=/<repository-name>/` and `VITE_API_URL` pointing to your Render backend.
   - Generate `dist/404.html` and `dist/.nojekyll` for clean client routing.
   - Deploy directly to GitHub Pages.

---

## Medical Disclaimer

> **Important**: Arogya Mitra is an educational tool designed to help you understand health documents in plain language. It does **not** provide medical diagnoses, treatment plans, prescriptions, or clinical medical advice. Always consult a qualified healthcare provider or physician with any questions regarding your medical condition, test results, or medications. In an emergency, contact your local emergency services (such as 112 or 911) immediately.
