const fs = require('fs');

const problemsJson = JSON.parse(fs.readFileSync('src/data/problems.json', 'utf8'));

// Group by topic
const groups = {};
problemsJson.forEach(p => {
  const t = p.topic || 'Other';
  if (!groups[t]) groups[t] = [];
  groups[t].push(p.title);
});

// Sort topics and titles
const topics = Object.keys(groups).sort();
let outputText = '';

topics.forEach(topic => {
  outputText += `### ${topic}\n`;
  const uniqueTitles = [...new Set(groups[topic])].sort();
  uniqueTitles.forEach(title => {
    outputText += `${title}\n`;
  });
  outputText += '\n';
});

fs.writeFileSync('../all_problems.txt', outputText);
console.log('List of all problems written to /home/mdasif/Documents/production_rag/all_problems.txt');
