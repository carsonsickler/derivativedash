# Render Deployment Guide

## Setup Instructions

### Option 1: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Create a new "Web Service"
   - Connect your repository

2. **Configure Build Settings:**
   - **Build Command:** `npm install && npm run build:web`
   - **Start Command:** `npm run serve`
   - **Environment:** `Node`

3. **Environment Variables:**
   - `NODE_ENV=production`
   - `PORT` (automatically set by Render)

### Option 2: Using render.yaml

If you have `render.yaml` in your repo, Render will automatically use it.

## Build Process

1. **Install Dependencies:** `npm install`
2. **Build Web Version:** `npm run build:web` (exports to `web-build/`)
   - This runs: `npx expo export --platform web`
3. **Serve Static Files:** `npm run serve` (starts Express server on PORT)

## Render Configuration

### In Render Dashboard:

**Build Command:**
```bash
npm install && npm run build:web
```

**Start Command:**
```bash
npm run serve
```

**Environment:**
- `Node`

**Environment Variables:**
- `NODE_ENV=production`
- `PORT` (automatically set by Render)

## Important Notes

- The `web-build/` directory is generated during build and contains static files
- The Express server (`server.js`) serves these static files
- All routes are handled client-side (SPA routing)

## Troubleshooting

### If build fails:
- Make sure all dependencies are in `package.json`
- Check that `npm run build:web` works locally first
- Verify Node.js version (should be >= 14.0.0)
- If `expo export` command fails, try installing `@expo/cli`:
  ```bash
  npm install --save-dev @expo/cli
  ```
- Alternative: Change build command to use local expo:
  ```bash
  npm install && npx expo export --platform web
  ```

### If server fails to start:
- Check that `web-build` directory exists after build
- Verify PORT environment variable is set
- Check server.js is in the root directory

## Local Testing

Test the production build locally:
```bash
npm run build:web
npm run serve
```

Then visit `http://localhost:3000`

