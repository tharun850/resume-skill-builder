# Resume Skill Updater

An Angular app that:
1. Takes a screenshot of a job portal's "skill match" widget (like the one Naukri/LinkedIn shows,
   with highlighted chips for skills you already have and plain chips for ones you're missing)
2. Sends it to an AI vision model (your choice: local via LM Studio, or a hosted API) with instructions
   to identify **only the non-highlighted (missing) skill chips**
3. Shows you the results to approve/edit before anything is added — nothing merges in automatically
4. Adds approved skills to a single flat "Technical Skills" list (no sub-categories) and generates a
   fresh, styled PDF resume for download

## Run it

```bash
npm install
npm start
```

Then open http://localhost:4200

## AI setup

Open **AI Settings** at the top of the page and choose a provider:

- **Local (LM Studio)**: Point it at LM Studio's local server (Developer tab → Start Server), default
  `http://localhost:1234/v1`. You need a **vision-capable** local model loaded, since the app has to
  read chip colors/borders in the screenshot, not just text — a text-only model won't work for this.
- **Hosted API**: Point it at any OpenAI-compatible endpoint (e.g. `https://api.openai.com/v1`) and
  paste your API key. Only used for this one image-analysis call; not stored anywhere except your
  own browser's local storage.

Settings are saved in your browser's local storage so you only need to set them once.

## Deploy to GitHub Pages

This app is a pure static site (no backend, no server-side rendering), so it deploys cleanly to
GitHub Pages. API keys/settings you enter live only in your own browser's local storage — nothing
is baked into the deployed files or visible to anyone else who visits the page.

**One-time setup:**

1. Push this project to a GitHub repo (e.g. `skill-resume-builder`)
2. In the repo, go to **Settings → Pages → Build and deployment → Source**, set it to
   **"Deploy from a branch"**, and select the `gh-pages` branch (it won't exist yet — that's fine,
   the first deploy below creates it)

**Deploy:**

```bash
npm run deploy
```

This builds the app with the correct base path for a GitHub Pages project site
(`/skill-resume-builder/`) and pushes the static output to the `gh-pages` branch using
`angular-cli-ghpages`. After a minute or two, your app will be live at:

```
https://<your-github-username>.github.io/skill-resume-builder/
```

**If you rename the repo**, or deploy to a different repo name, edit the `--base-href` value in
the `deploy` script in `package.json` to match (`/<your-repo-name>/`). If you're deploying to a
*user/org* GitHub Pages site instead (`<username>.github.io` repo itself, not a project subpage),
use `--base-href "/"` instead.

**Re-deploying after changes:** just run `npm run deploy` again — it rebuilds and re-pushes.

**Note on local AI**: if you use the "Local (LM Studio)" provider, that only works when *you*
open the deployed page on the *same machine* running LM Studio — `localhost` always refers to
the visiting browser's own machine, not a server. The hosted API provider works from any device.

- Your base resume content lives in `src/app/services/resume-data.service.ts` — edit the `BASE_RESUME`
  object there if your actual resume content changes.
- Technical Skills is a single flat list on both the resume data model and the generated PDF —
  there are no sub-category labels like "Frontend"/"Backend" anymore.
- The AI is specifically prompted to distinguish highlighted (already-matched) vs. plain
  (missing) skill chips by their visual styling — this only works with a vision-capable model.
- Nothing is added to your resume without your explicit approval in the review step.
- If the AI provider returns a transient error (503 "high demand", 502/504 gateway errors, or
  429 rate limiting), the app automatically retries up to 3 times with exponential backoff
  (1.5s, 3s, 6s), showing you a "retrying..." status. Non-transient errors (bad API key, bad
  request) fail immediately instead of wasting time retrying something that won't succeed.
- PDF generation uses **jsPDF** with the browser's built-in standard fonts (no embedded font
  files), instead of a heavier layout-engine library. This keeps the initial page load at
  roughly 174 kB transferred instead of ~680 kB — noticeably faster on a slow connection.

## Known limitations

- Chip-highlight detection depends on the vision model's ability to perceive color/border
  differences — results can vary by model quality. Always sanity-check the extracted list.
- If a screenshot has ambiguous or unusual chip styling, the AI is instructed to return an empty
  list rather than guess — you'll see a message asking you to try a clearer screenshot.
