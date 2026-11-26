const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match <Image ... fill ... /> and if it doesn't have sizes, add sizes
  // This is a basic string replace for the ones missing sizes
  let changed = false;
  
  content = content.replace(/<Image([^>]*?)fill([^>]*?)>/g, (match, p1, p2) => {
    if (match.includes('sizes=')) return match;
    changed = true;
    return `<Image${p1}fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"${p2}>`;
  });
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
