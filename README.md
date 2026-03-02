# Fishing
A basic app that tracks what fish is caught and where, then using free online repositories tracks the time, barometric pressure, weather, temperature, moon phase

## Publishing

- **Automatic deploy:** This repository now contains a GitHub Actions workflow that deploys the site to GitHub Pages on every push to the `main` branch.
- **Workflow location:** [.github/workflows/pages.yml](.github/workflows/pages.yml)
- **Site URL (after first deploy):** https://HFrank3.github.io/Fishing

How to publish:

1. Commit and push your changes to the `main` branch.
2. The workflow will run and publish the repository contents to GitHub Pages.
3. If Pages doesn't appear, open the repository Settings → Pages and confirm the site: it should be managed by GitHub Actions.

Notes:

- The workflow uses the official Pages Actions to upload and deploy a static `public` artifact.
- If you want a custom domain or icons, add them to the repository and update the manifest or Pages settings.
