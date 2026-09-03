const fs = require('fs');

const problemsJson = JSON.parse(fs.readFileSync('src/data/problems.json', 'utf8'));

// Helper to escape CSV values safely for Google Sheets
function escapeCSV(val) {
  if (val === undefined || val === null) return '""';
  let str = String(val);
  // Replace internal quotes with double quotes
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

// 1. Sort problems progressively: First Easy, then Medium, then Hard, while maintaining topic interleaving!
// Group by difficulty
const easyProbs = [];
const mediumProbs = [];
const hardProbs = [];
const otherProbs = [];

problemsJson.forEach(p => {
  const diff = (p.difficulty || 'Medium').toLowerCase().trim();
  if (diff === 'easy') easyProbs.push(p);
  else if (diff === 'medium') mediumProbs.push(p);
  else if (diff === 'hard') hardProbs.push(p);
  else mediumProbs.push(p);
});

// Create interleaved progressive list: Phase 1 (Easy), Phase 2 (Medium), Phase 3 (Hard)
const progressiveList = [];

// Phase 1: Foundations (Easy)
easyProbs.forEach(p => {
  progressiveList.push({
    ...p,
    phase: 'Phase 1: Foundations'
  });
});

// Phase 2: Core Interview Mastery (Medium)
mediumProbs.forEach(p => {
  progressiveList.push({
    ...p,
    phase: 'Phase 2: Core Mastery'
  });
});

// Phase 3: Advanced & Hard FAANG (Hard)
hardProbs.forEach(p => {
  progressiveList.push({
    ...p,
    phase: 'Phase 3: Advanced FAANG'
  });
});

// Headers formatted specifically for Google Sheets
const headers = [
  "S.No",
  "Completed",                // FALSE (Google Sheets Checkbox)
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

const csvRows = [];
csvRows.push(headers.map(escapeCSV).join(','));

progressiveList.forEach((p, index) => {
  const companiesStr = Array.isArray(p.companies) ? p.companies.join(', ') : (p.companies || '');
  const row = [
    index + 1,                                       // S.No (1 to N)
    "FALSE",                                         // Completed (Google Sheets recognizes TRUE/FALSE as Checkbox)
    p.phase,                                         // Learning Phase
    p.topic || 'General',                           // Topic
    p.title || '',                                   // Problem Title
    p.difficulty || 'Medium',                        // Difficulty
    p.priority || 'P2',                              // Priority
    p.mlBoost ? '★' : '',                           // ML Boost
    p.pattern || '',                                 // Pattern
    companiesStr,                                    // Target Companies
    p.url || '',                                     // Problem Link
    '',                                              // My Solution (Paste Code Here)
    p.notes || ''                                    // Notes & Complexity
  ];
  csvRows.push(row.map(escapeCSV).join(','));
});

const csvContent = csvRows.join('\n');
const outputPath = '/home/mdasif/Documents/production_rag/Google_Sheets_DSA_Master_Progress_Tracker.csv';
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`Successfully created Google Sheets CSV at: ${outputPath}`);
console.log(`Total Problems in Progressive 1-to-N Order: ${progressiveList.length}`);
console.log(`- Phase 1 (Foundations - Easy): ${easyProbs.length}`);
console.log(`- Phase 2 (Core Mastery - Medium): ${mediumProbs.length}`);
console.log(`- Phase 3 (Advanced FAANG - Hard): ${hardProbs.length}`);
