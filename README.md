# ATH Studios

**Software, AI and automation projects by [Ahmed Tarek](https://github.com/AhmedTarek1967), built to solve real problems and make complex work simpler.**

🔗 **Live site:** https://ahmedtarek1967.github.io/ATH-Studios-Portfolio/

---

## What you will find here

ATH Studios is the portfolio site that collects my projects in one place. Each project has a live demo, a detail page that explains the problem and the solution, and a link to its public source code.

### Featured projects

| Project | What it does | Stack | Links |
|---|---|---|---|
| **HiringHR** | Hiring and HR automated end to end: PDF CV applications, AI scoring of every candidate, personal coaching reports, a policy grounded HR chatbot and failure monitoring. | n8n, Google Gemini, Google Workspace, Docker | [Live](https://ahmedtarek1967.github.io/HiringHR_automated/) · [Code](https://github.com/AhmedTarek1967/HiringHR_automated) |
| **Dawaa** | A bilingual (Arabic and English) pharmacy assistant concept that connects customer conversations with pharmacy information and workflows. | n8n, Google Gemini, Google Sheets, Telegram | [Live](https://ahmedtarek1967.github.io/Dawaa/) · [Code](https://github.com/AhmedTarek1967/Dawaa) |

> Features that depend on n8n need the configured n8n host to be online, so a live demo may not respond at every moment. Dawaa is a concept project, not a pharmacy in production.

## About the site

- Animated hero with a staggered entrance, mouse parallax and a custom scroll indicator
- Large project showcase with filters, hover effects and scroll parallax
- Full width statement section that reveals word by word as you scroll
- Contact form with validation that prepares an email, nothing is stored
- Responsive down to 390px, keyboard friendly, skip link, and `prefers-reduced-motion` support

Built with plain **HTML, CSS and JavaScript**. No framework, no build step, no animation library. The typeface is Manrope, self hosted.

## Run it locally

```bash
git clone https://github.com/AhmedTarek1967/ATH-Studios-Portfolio.git
cd ATH-Studios-Portfolio
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Project structure

```text
├── index.html            Home page
├── css/style.css         Styles and motion
├── js/projects.js        Project data
├── js/main.js            Rendering, filters, navigation, form
├── js/motion.js          Load sequence, parallax, cursor, scroll effects
├── assets/fonts/         Self hosted Manrope
└── projects/             One detail page per project
```

## Add a project

1. Add an entry to `js/projects.js` with its `appUrl` (the deployed app) and `github` link.
2. Create `projects/<id>/index.html` for its detail page.

## Contact

Open an issue or reach me through [GitHub](https://github.com/AhmedTarek1967).