# Deployment Checklist (Web)

## Build Targets

- ✅ Single-page React app
- ✅ Pure client-side rendering (no server needed)
- ✅ Optimized CSS + minimal bundles

## Pre-Deployment Testing

1. **Run tests manually**
   ```bash
   npm run dev
   ```
   - Verify all levels load
   - Confirm hint + Enter-to-submit functionality
   - Ensure layout works on mobile breakpoints

2. **Production build & preview**
   ```bash
   npm run build
   npm run preview
   ```

## Render Deployment

- **Service Type:** Static Site
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

See `render.yaml` for an example configuration.

## Performance Notes

- No API calls (all data local)
- State updates limited to 4 inputs + metadata
- Pure React 18 + Vite (fast dev/build)
- CSS optimized for mobile + desktop

## Post-Deploy Checklist

- [ ] Test on desktop browsers (Chrome, Safari, Edge)
- [ ] Test on at least one mobile browser
- [ ] Validate hint + reset + next buttons
- [ ] Confirm SPA routing (all 200 from static host)

## Troubleshooting

- If deployment fails, ensure Node >= 18 locally
- Delete `node_modules` / reinstall if build errors occur
- Clear Render cache if old artifacts persist

