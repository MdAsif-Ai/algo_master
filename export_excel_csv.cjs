const fs = require('fs');

const problemsJson = JSON.parse(fs.readFileSync('src/data/problems.json', 'utf8'));

// Helper to escape CSV values safely
function escapeCSV(val) {
  if (val === undefined || val === null) return '""';
  let str = String(val);
  // Replace internal quotes with double quotes
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

// Build CSV Header
const headers = [
  "S.No",
  "Topic",
  "Problem Title",
  "Difficulty",
  "Priority",
  "ML Boost (AI/ML)",
  "Pattern / Concept",
  "Target Companies",
  "Status",
  "Problem Link",
  "My Solution (Code)",
  "Notes & Complexity"
];

const csvRows = [];
csvRows.push(headers.map(escapeCSV).join(','));

problemsJson.forEach((p, index) => {
  const companiesStr = Array.isArray(p.companies) ? p.companies.join(', ') : (p.companies || '');
  const row = [
    index + 1,                                       // S.No
    p.topic || 'General',                           // Topic
    p.title || '',                                   // Problem Title
    p.difficulty || 'Medium',                        // Difficulty
    p.priority || 'P2',                              // Priority
    p.mlBoost ? '★' : '',                           // ML Boost
    p.pattern || '',                                 // Pattern
    companiesStr,                                    // Target Companies
    'Unsolved',                                      // Status (Default for user tracking)
    p.url || '',                                     // Problem Link
    '',                                              // My Solution (Code) - blank for user to paste
    p.notes || ''                                    // Notes & Complexity
  ];
  csvRows.push(row.map(escapeCSV).join(','));
});

const csvContent = csvRows.join('\n');

const outputPath = '/home/mdasif/Documents/production_rag/DSA_Master_Tracker_678_Questions.csv';
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`Successfully generated Excel CSV at: ${outputPath}`);
console.log(`Total rows exported: ${problemsJson.length}`);
