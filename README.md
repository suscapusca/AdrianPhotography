# Schipor Adrian Portfolio

Premium photographer portfolio website with a cinematic public frontend and a private admin area.

## Stack

- React + Vite + TypeScript
- GSAP + ScrollTrigger for motion
- Express API with cookie-based admin auth
- JSON file persistence in `storage/content`
- Disk uploads in `storage/uploads`

## Scripts

- `npm run dev` starts the Vite client and the API server together
- `npm run build` builds the client and server for production
- `npm run typecheck` runs frontend and backend TypeScript checks
- `npm start` serves the built app from `dist` with the compiled API server

## Default Admin Credentials

Set these in `.env` or use `.env.example` as a starting point:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `PORT`

The seeded local defaults are:

- Username: `admin`
- Password: `change-me`

## Content Storage

- Site-wide content: `storage/content/site.json`
- Portfolio items: `storage/content/portfolio.json`
- Categories: `storage/content/categories.json`
- Uploaded files: `storage/uploads`

## Project Structure

- `src/app` router and app bootstrapping
- `src/features/public` public pages and portfolio experience
- `src/features/admin` admin dashboard, editors, and auth state
- `src/shared` shared schemas, helpers, hooks, and styling
- `server` Express API, file storage, auth, and upload handling
- `public` seeded fonts and media used by the initial portfolio
