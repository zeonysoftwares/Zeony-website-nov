const https = require('https');

// Render sets this environment variable automatically for web services
const url = process.env.RENDER_EXTERNAL_URL;

if (!url) {
  console.log("Auto-ping disabled: RENDER_EXTERNAL_URL is not set.");
} else {
  console.log(`Starting auto-ping for ${url} every 7 minutes to prevent Render from sleeping...`);
  
  // 7 minutes in milliseconds
  const interval = 7 * 60 * 1000;

  setInterval(() => {
    https.get(url, (res) => {
      console.log(`[Auto-ping] ${url} - Status: ${res.statusCode}`);
    }).on('error', (e) => {
      console.error(`[Auto-ping] Error: ${e.message}`);
    });
  }, interval);
}
