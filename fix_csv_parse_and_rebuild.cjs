const fs = require('fs');

let problemsJson = JSON.parse(fs.readFileSync('src/data/problems.json', 'utf8'));

// Fix any title truncated due to commas (e.g. 'Pow(x' -> 'Pow(x, n)')
problemsJson.forEach(p => {
  if (p.title === 'Pow(x') {
    p.title = 'Pow(x, n)';
  }
});

// Run deduplication pass again
const canonicalMap = {
  "pow(x": "Pow(x, n)",
  "pow(x, n)": "Pow(x, n)",
  "rotten oranges (stack/queue variant)": "Rotting Oranges",
  "rotten oranges": "Rotting Oranges",
  "merge sort algorithm (concept/impl)": "Merge Sort Algorithm",
  "sliding window median (added)": "Sliding Window Median",
  "course schedule iii (added)": "Course Schedule III",
  "word ladder ii (added)": "Word Ladder II",
  "shortest path in directed acyclic graph (added)": "Shortest Path in DAG",
  "two city scheduling (added)": "Two City Scheduling",
  "russian doll envelopes (added)": "Russian Doll Envelopes",
  "longest palindromic subsequence (added)": "Longest Palindromic Subsequence",
  "scramble string (added)": "Scramble String"
};

function getNormKey(str) {
  let s = str.toLowerCase().trim();
  if (canonicalMap[s]) {
    s = canonicalMap[s].toLowerCase().trim();
  }
  return s
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]/g, '');
}

const seenKeys = new Map();
const cleanList = [];

problemsJson.forEach(p => {
  const normKey = getNormKey(p.title);
  const lowerTitle = p.title.toLowerCase().trim();
  const canonicalTitle = canonicalMap[lowerTitle] || p.title;

  if (!seenKeys.has(normKey)) {
    const cleaned = {
      ...p,
      title: canonicalTitle
    };
    seenKeys.set(normKey, cleaned);
    cleanList.push(cleaned);
  }
});

// Write cleaned problems.json
fs.writeFileSync('src/data/problems.json', JSON.stringify(cleanList, null, 2), 'utf8');

// Helper to escape CSV values safely for Google Sheets
function escapeCSV(val) {
  if (val === undefined || val === null) return '""';
  let str = String(val);
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

// Group by difficulty for progressive learning order
const easyProbs = cleanList.filter(p => (p.difficulty || '').toLowerCase() === 'easy');
const mediumProbs = cleanList.filter(p => (p.difficulty || '').toLowerCase() === 'medium');
const hardProbs = cleanList.filter(p => (p.difficulty || '').toLowerCase() === 'hard');
const otherProbs = cleanList.filter(p => !['easy', 'medium', 'hard'].includes((p.difficulty || '').toLowerCase()));

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

console.log(`Rebuild Complete:`);
console.log(`- Final unique problems: ${progressiveList.length}`);
console.log(`- Phase 1 (Easy): ${easyProbs.length}`);
console.log(`- Phase 2 (Medium): ${mediumProbs.length + otherProbs.length}`);
console.log(`- Phase 3 (Hard): ${hardProbs.length}`);
