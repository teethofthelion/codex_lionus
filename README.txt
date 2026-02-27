# CodexLionusViewer (GitHub Pages) — v1.0

A tiny, skinnable PDF.js viewer so Codex Lionus looks like a manuscript (no browser PDF toolbar).

## 1) Put this folder on GitHub
- Create a new repo (public) e.g. `codex-lionus`
- Upload these files:
  - `index.html`
  - `style.css`
  - `viewer.js`

## 2) Enable GitHub Pages
Repo → Settings → Pages
- Source: Deploy from a branch
- Branch: `main` / root
- Save

Your viewer will be available at:
`https://YOURUSERNAME.github.io/YOURREPO/`

## 3) Point it at your PDF
Open `viewer.js` and change:

`const PDF_URL = "https://www.teethofthelion.com/s/CODEX_LIONUS_MMXXVI_v04.pdf";`

to the latest Codex PDF URL when you update.

## 4) Embed into Squarespace (TOTL)
Use a Code Block with:

<iframe src="https://YOURUSERNAME.github.io/YOURREPO/" style="width:100%;height:92vh;border:0;"></iframe>

That's it.

## Notes
- The PDF URL must be publicly reachable (no login).
- Safari/Chrome/Firefox all show the same clean look because we render pages ourselves.
