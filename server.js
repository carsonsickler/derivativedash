// Simple server for Render deployment
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const buildPath = path.join(__dirname, 'web-build');

// Check if web-build directory exists
if (!fs.existsSync(buildPath)) {
  console.error('ERROR: web-build directory not found!');
  console.error('Please run "npm run build:web" first.');
  process.exit(1);
}

// Serve static files from the web-build directory
app.use(express.static(buildPath));

// Handle client-side routing - return index.html for all routes
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build files not found. Please run "npm run build:web" first.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving files from: ${buildPath}`);
});

