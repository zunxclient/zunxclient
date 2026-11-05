# Zunx Client website

Static site (no build step).

## Publish on GitHub Pages
1. Put all these files in the root of your repo (keep `.github/` and `.nojekyll`).
2. Repo **Settings > Pages > Source: GitHub Actions**.
3. Push to `main`. The site appears at `https://<user>.github.io/<repo>/`.

Installers come from this repo's **Releases** (see `githubRepo` in `config.json`).
For a custom domain, add a `CNAME` file and update the `og:url` / `og:image` links in the HTML.

## Look and ads
- Dark and light theme: the switch is in the top bar, the choice is remembered, and the first visit follows the visitor's system setting. Colours live in the two variable blocks at the top of `site.css`.
- All ads are set up in one place, the "ads" block in `site.js` (side rails on wide screens, one banner per slot, native banner and social bar). Banner size is chosen from the screen width, so nothing overflows on phones.
