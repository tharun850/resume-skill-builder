# Resume Skill Matcher

A privacy-focused, client-side Angular web application designed to help software engineers tailor their resumes for job portals (such as LinkedIn, Naukri, and Indeed) in seconds.

---

## What It Does

When applying for roles on job portals, skill match widgets often display which required skills you already match and which ones you're missing. Manually comparing, typing, and formatting these missing skills into your resume for every application is tedious.

This app streamlines that workflow:
1. **Screenshot Missing Skills**: Paste or drop a screenshot of the job portal's skill match widget.
2. **AI Vision Extraction**: A vision-enabled model identifies and extracts **only the missing (unmatched/non-highlighted) skills**, filtering out what you already have.
3. **Interactive Review**: Review, toggle, or manually add missing keywords.
4. **Instant PDF Generation**: Generates an updated, ATS-friendly PDF resume formatted with standard typography for download.

---

## Quick Start

### 1. Install Dependencies
```bash
cd app
npm install
```

### 2. Start the Development Server
```bash
npm start
```
Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## AI Configuration

Click **AI Model Settings** at the top of the app to configure your vision provider:

### Option A: Local AI (LM Studio / Ollama) — 100% Free & Private
- Run [LM Studio](https://lmstudio.ai/) on your machine.
- Load a **vision-capable model** (e.g., `Qwen2-VL`, `LLaVA`, or `Llama-3.2-Vision`).
- Start the local server under the **Developer** tab (default: `http://localhost:1234/v1`).
- Enable CORS in LM Studio settings.

### Option B: Hosted OpenAI-Compatible API
- Set your provider to **OpenAI-Compatible API**.
- Base URL: `https://api.openai.com/v1` (or your custom provider like OpenRouter / Groq).
- Model: `gpt-4o-mini` (or any vision model).
- API Key: Paste your key. *(Stored exclusively in your browser's `localStorage` — never transmitted to any third-party server).*

---

## Deploy to GitHub Pages

This app is completely client-side (no backend required), making it ideal for hosting for free on **GitHub Pages**.

### Method 1: Automated GitHub Actions (Recommended)

An automated deployment workflow is already configured in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for resume skill matcher"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub: **Settings → Pages**.
   - Under **Build and deployment → Source**, choose **GitHub Actions**.
   - Your site will automatically build and deploy within 1-2 minutes at:
     ```
     https://<your-username>.github.io/<your-repo-name>/
     ```

---

### Method 2: Manual CLI Deployment

If you prefer deploying via the CLI using `angular-cli-ghpages`:

1. Update the `--base-href` in `app/package.json` to match your repository name:
   ```json
   "deploy": "ng build --configuration production --base-href \"/<your-repo-name>/\" && npx angular-cli-ghpages --dir=dist/app/browser"
   ```
2. Run:
   ```bash
   npm run deploy
   ```
3. In GitHub: **Settings → Pages**, set the source branch to `gh-pages`.

---

## Customizing Your Resume Profile

You can customize your resume in two ways:

### 1. In the Web App (Easiest)
Click **Resume Profile Editor** directly at the top of the webpage to edit:
- Name, headline, contact info, and LinkedIn link.
- Professional summary.
- Work experience entries, roles, companies, and bullet points.
- Base technical skills.
- Education and certifications.
- Import/Export complete resume profiles via JSON with 1 click.

All changes are saved automatically to your browser's `localStorage`.

### 2. In Code
Your default baseline template lives in [`app/src/app/services/resume-data.service.ts`](app/src/app/services/resume-data.service.ts) (`BASE_RESUME`).

---

## Tech Stack

- **Framework**: Angular 19 (Standalone Components, Signals, Reactive Forms)
- **PDF Engine**: [jsPDF](https://github.com/parallax/jsPDF) using built-in vector fonts (ultra-lightweight bundle, fast rendering)
- **Vision Integration**: OpenAI-compatible Vision API protocol
- **Styling**: Modern CSS variables, responsive flex/grid layouts
