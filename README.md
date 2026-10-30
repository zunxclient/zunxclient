# Zunx Client website

Static site (no build step).

## Publish on GitHub Pages
1. Put all these files in the root of your repo (keep `.github/` and `.nojekyll`).
2. Repo **Settings > Pages > Source: GitHub Actions**.
3. Push to `main`. The site appears at `https://<user>.github.io/<repo>/`.

Installers come from this repo's **Releases** (see `githubRepo` in `config.json`).
For a custom domain, add a `CNAME` file and update the `og:url` / `og:image` links in the HTML.
