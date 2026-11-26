# ATH Studios Portfolio

A responsive, dark-themed multi-project portfolio built with plain HTML, CSS and JavaScript.

## Run locally
Open `index.html` in a browser, or run a local static server:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500`.

## Add a new project
1. Create `projects/your-project/index.html`.
2. Add a project object to `js/projects.js`, including its deployed `appUrl` and GitHub `github` URL.
3. Use `../../css/style.css` from the nested project page.
4. Link the project card to `projects/your-project/`.

The homepage cards are rendered from `js/projects.js`, so the listing stays data-driven. The **Launch application** action opens `appUrl` in a new tab. `appUrl` must be the live deployed application URL; a GitHub repository URL is not an application URL.

## Deploy with GitHub Pages
1. Create a new public repository, for example `ATH-Studios-Portfolio`.
2. Upload the contents of this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for the Pages deployment and open the published URL.

## Before publishing
- Replace the placeholder email `ahmed.tarek@example.com` in `index.html` with your preferred public contact email.
- Confirm each project description and technology list reflects the current implementation.
- Add real project screenshots under `assets/` when available.
- Never put API keys, webhook secrets, passwords or private credentials in this static website.

## Structure
```text
ath-studios-portfolio/
├── index.html
├── 404.html
├── assets/fonts/manrope.woff2
├── css/style.css
├── js/projects.js
├── js/main.js
├── projects/
│   ├── ath-studios/index.html
│   └── dawaa/index.html
└── README.md
```


## Application launch links
The portfolio now opens each application in a separate browser tab. The current `appUrl` values are expected GitHub Pages URLs:
- ATH Studios: `https://ahmedtarek1967.github.io/ATH-Studios-n8n/`
- Dawaa: `https://ahmedtarek1967.github.io/Dawaa/`

These links work only after GitHub Pages is enabled and successfully deployed for the respective repositories. Confirm each URL from **Repository → Settings → Pages → Visit site**. If a project uses a backend (for example PHP), it needs a host that supports that backend; GitHub Pages only serves static files.

## Design notes
The redesign keeps the original palette (`#09090d`, `#14131a`, `#191720`, `#2b2934`, `#f5f0e7`, `#b4a89b`, `#e0b52f` and its gold tints) and uses a single self hosted typeface, Manrope. Contact form messages open in the visitor's email app using `data-email` on `#contact-form` in `index.html`; replace that placeholder address before publishing.


## Landing page motion
The homepage uses `css/landing.css` and `js/main.js` (vanilla CSS transforms, IntersectionObserver and one requestAnimationFrame loop, no animation library). Brand palette and Manrope are unchanged. Motion is disabled under `prefers-reduced-motion`, and the pinned horizontal project showcase only runs on screens 1000px wide or more. Icons are Phosphor (MIT).
