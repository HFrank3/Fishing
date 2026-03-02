🎣 FishLog - Group Fishing Tracker

FishLog is a Progressive Web App (PWA) designed for collaborative fishing trips. Built for anglers in the Geneva, NY area, it automatically enriches catch data with real-time environmental physics, allowing a group to track not just what they caught, but the conditions that led to success.
🌟 Key Features

    Environmental Data Sync: Automatically fetches barometric pressure, temperature, and weather data via the Open-Meteo API.

    Lunar Tracking: Calculates current moon phase and illumination percentage for every catch.

    Interactive Maps: Visualizes catch locations using Leaflet.js with a "Secret Spot" privacy toggle.

    Live Leaderboards: Features real-time standings for Top Anglers, Species Trophies, and Overall Heavyweights.

    Offline Support: Powered by a Service Worker and IndexedDB, allowing you to log catches in remote areas without a signal.

    Mobile Optimized: PWA support including haptic feedback (vibration) on record success and a standalone "app-like" experience.

🛠️ Tech Stack

    Frontend: HTML5, Tailwind CSS, Vanilla JavaScript.

    Database: Firebase Realtime Database.

    Maps: Leaflet.js (OpenStreetMap).

    APIs: Open-Meteo (Weather/Baro).

    Deployment: GitHub Actions & GitHub Pages.

🚀 Publishing & Deployment
Automatic Deploy

This repository uses GitHub Actions to deploy the site to GitHub Pages on every push to the main branch.

    Site URL: https://HFrank3.github.io/Fishing

    Workflow: .github/workflows/static.yml

How to Update

    Commit and push your changes to the main branch.

    The workflow will automatically build the artifact and update the live site.

    Note: If the site doesn't update immediately, perform a Hard Refresh (Ctrl+F5) to clear the Service Worker cache.

🔒 Security Note

The application currently uses open Firebase rules for collaborative logging. For production environments, it is recommended to implement Firebase Authentication to secure user data and delete permissions.
