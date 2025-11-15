# Fix for Render Deployment Error

## The Problem
Render is trying to run `node node_modules/expo/AppEntry.js` instead of our Express server.

## The Solution

### Option 1: Update Render Dashboard (Recommended)

1. Go to your Render dashboard
2. Select your web service
3. Go to **Settings**
4. Update the **Start Command** to:
   ```
   npm start
   ```
5. Make sure **Build Command** is:
   ```
   npm install && npm run build:web
   ```
6. Save and redeploy

### Option 2: Verify render.yaml

If you're using `render.yaml`, make sure it's in the root of your repository and contains:
```yaml
services:
  - type: web
    name: derivation-dash
    env: node
    buildCommand: npm install && npm run build:web
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

## What Changed

1. **package.json**: Changed `"main"` from `"node_modules/expo/AppEntry.js"` to `"server.js"`
2. **package.json**: Changed `"start"` script to `"node server.js"` (for production)
3. **package.json**: Added `"dev"` script for local development (`expo start`)

## Verification

After updating, the deployment should:
1. ✅ Run `npm install` (install dependencies)
2. ✅ Run `npm run build:web` (build static files)
3. ✅ Run `npm start` (start Express server on PORT)

The server will serve files from the `web-build/` directory.

## If Still Not Working

If Render still uses the wrong command, you can also try:
- **Start Command:** `node server.js`
- Or: `PORT=$PORT node server.js`

Make sure `server.js` exists in the root directory!

