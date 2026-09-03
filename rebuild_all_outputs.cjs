const fs = require('fs');

const problemsJson = JSON.parse(fs.readFileSync('src/data/problems.json', 'utf8'));

// Helper to escape CSV values safely for Google Sheets
function escapeCSV(val) {
  if (val === undefined || val === null) return '""';
  let str = String(val);
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

// Group by difficulty for progressive learning order
const easyProbs = problemsJson.filter(p => (p.difficulty || '').toLowerCase() === 'easy');
const mediumProbs = problemsJson.filter(p => (p.difficulty || '').toLowerCase() === 'medium');
const hardProbs = problemsJson.filter(p => (p.difficulty || '').toLowerCase() === 'hard');
const otherProbs = problemsJson.filter(p => !['easy', 'medium', 'hard'].includes((p.difficulty || '').toLowerCase()));

const progressiveList = [];

easyProbs.forEach(p => progressiveList.push({ ...p, phase: 'Phase 1: Foundations (Easy)' }));
mediumProbs.forEach(p => progressiveList.push({ ...p, phase: 'Phase 2: Core Mastery (Medium)' }));
hardProbs.forEach(p => progressiveList.push({ ...p, phase: 'Phase 3: Advanced FAANG (Hard)' }));
otherProbs.forEach(p => progressiveList.push({ ...p, phase: 'Phase 2: Core Mastery (Medium)' }));

// 1. Generate Google Sheets Progressive CSV
const headersGoogle = [
  "S.No",
  "Completed",                                      // FALSE (Google Sheets Checkbox)
  "Learning Phase",
  "Topic",
  "Problem Title",
  "Difficulty",
  "Priority",
  "ML Boost (AI/ML)",
  "Pattern / Technique",
  "Target Companies",
  "Problem Link",
  "My Solution (Paste Code Here)",
  "Notes & Time/Space Complexity"
];

const csvRowsGoogle = [];
csvRowsGoogle.push(headersGoogle.map(escapeCSV).join(','));

progressiveList.forEach((p, index) => {
  const companiesStr = Array.isArray(p.companies) ? p.companies.join(', ') : (p.companies || '');
  const row = [
    index + 1,
    "FALSE",                                         // Interactive Checkbox
    p.phase,
    p.topic || 'General',
    p.title || '',
    p.difficulty || 'Medium',
    p.priority || 'P2',
    p.mlBoost ? '★' : '',
    p.pattern || '',
    companiesStr,
    p.url || '',
    '',                                              // My Solution
    p.notes || ''
  ];
  csvRowsGoogle.push(row.map(escapeCSV).join(','));
});

fs.writeFileSync(
  '/home/mdasif/Documents/production_rag/Google_Sheets_DSA_Master_Progress_Tracker.csv',
  csvRowsGoogle.join('\n'),
  'utf8'
);

// 2. Generate problem_names_only.txt
const namesOnly = progressiveList.map(p => p.title).join('\n');
fs.writeFileSync(
  '/home/mdasif/Documents/production_rag/problem_names_only.txt',
  namesOnly,
  'utf8'
);

console.log(`Rebuilt outputs successfully:`);
console.log(`- Deduplicated total: ${progressiveList.length} problems`);
console.log(`- Phase 1 (Easy): ${easyProbs.length}`);
console.log(`- Phase 2 (Medium): ${mediumProbs.length + otherProbs.length}`);
console.log(`- Phase 3 (Hard): ${hardProbs.length}`);
