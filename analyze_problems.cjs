const fs = require('fs');

const userList = fs.readFileSync('user_problems.txt', 'utf8');
const problemsJson = JSON.parse(fs.readFileSync('src/data/problems.json', 'utf8'));

// Extract problem titles from user list
const userProblems = userList.split('\n')
  .filter(line => line.trim().length > 0 && line.includes('—'))
  .map(line => line.split('—')[0].trim());

// Dedup user problems
const uniqueUserProblems = [...new Set(userProblems)];
console.log(`\nTotal unique problems in the user's list: ${uniqueUserProblems.length}`);

// Extract problem titles from existing JSON
const existingTitles = new Set(problemsJson.map(p => p.title.toLowerCase().trim()));

// Find missing ones
const missingProblems = [];
for (const p of uniqueUserProblems) {
  if (!existingTitles.has(p.toLowerCase())) {
    missingProblems.push(p);
  }
}

console.log(`Problems missing from the database: ${missingProblems.length}`);
if (missingProblems.length > 0) {
  console.log('Missing Problems:');
  missingProblems.forEach(m => console.log('- ' + m));
}
