# Render Deployment Settings

This app is a Vite React static site.

Use these settings on Render:

- Service type: Static Site
- Branch: main
- Root Directory: leave blank if the app files are at the repo root
- Build Command: npm run build
- Publish Directory: dist

Important:
The `.npmrc` file sets `legacy-peer-deps=true` so Render can install the existing `react-qr-reader` package with React 19.

After deployment, test the Render `https://...onrender.com` link on your phone and allow camera permission for QR scanning.

Current limitation:
The app currently stores submission history only in browser memory. For real warehouse usage, add a backend/database or Google Sheets/Supabase integration so audit logs are permanently saved.
