const fs = require('fs');

const problemsJson = JSON.parse(fs.readFileSync('src/data/problems.json', 'utf8'));

// Extract titles only in exact sequence
const titles = problemsJson.map(p => p.title);

const textOutput = titles.join('\n');

fs.writeFileSync('/home/mdasif/Documents/production_rag/problem_names_only.txt', textOutput, 'utf8');

console.log(`Successfully written ${titles.length} problem names to problem_names_only.txt`);
