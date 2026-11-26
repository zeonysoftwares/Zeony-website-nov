const fs = require('fs');

async function scrapePage(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    // A very rough HTML to text converter
    const text = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return `\n\n--- CONTENT FROM ${url} ---\n\n${text}\n`;
  } catch (e) {
    return `\n\n--- ERROR FETCHING ${url} ---\n\n${e.message}\n`;
  }
}

async function main() {
  const urls = [
    'https://zeonytechnologies.com/',
    'https://zeonytechnologies.com/about.php',
    'https://zeonytechnologies.com/services.php',
    'https://zeonytechnologies.com/contact.php'
  ];
  
  let result = '';
  for (const url of urls) {
    console.log('Fetching', url);
    result += await scrapePage(url);
  }
  
  fs.writeFileSync('scraped.txt', result);
  console.log('Done!');
}

main();
