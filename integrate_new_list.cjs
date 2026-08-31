const fs = require('fs');

const rawText = fs.readFileSync('user_raw_list.txt', 'utf8');
const problemsJson = JSON.parse(fs.readFileSync('src/data/problems.json', 'utf8'));

const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

let currentTopic = '';
const parsedProblems = [];

const topicRegex = /^(?:[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF])?\s*\d+\.\s*(.*)$/i;

// Parse the file
for (const line of lines) {
  const match = line.match(topicRegex);
  if (match) {
    currentTopic = match[1].trim();
    // Normalize DP and Stack
    if (currentTopic === 'Stack') currentTopic = 'Stack & Queue';
    if (currentTopic === 'Queue / Deque') currentTopic = 'Stack & Queue';
    if (currentTopic === 'Monotonic Stack / Queue') currentTopic = 'Stack & Queue';
    if (currentTopic === 'Binary Trees') currentTopic = 'Binary Trees & BST';
    if (currentTopic === 'BST') currentTopic = 'Binary Trees & BST';
    if (currentTopic === 'Heap / Priority Queue') currentTopic = 'Heap & Priority Queue';
    if (currentTopic === 'Graph BFS / DFS') currentTopic = 'Graphs';
    if (currentTopic === 'Shortest Path / Advanced Graph') currentTopic = 'Graphs';
    if (currentTopic === 'Union Find') currentTopic = 'Graphs';
    if (currentTopic.startsWith('Dynamic Programming')) currentTopic = 'Dynamic Programming';
    if (currentTopic === 'Strings') currentTopic = 'Arrays & Hashing'; // Or keep Strings as category? The existing JSON had no 'Strings' topic except Arrays & Hashing. Wait, let's look at the topics.
    // Let's check existing topics in problemsJson to map reasonably.
  } else {
    // Check if it's a sub-header or note
    if (line.includes('valuable for stronger') || line.startsWith('#')) {
      continue;
    }
    if (currentTopic) {
      parsedProblems.push({
        title: line,
        topic: currentTopic
      });
    }
  }
}

// Normalize topics based on existing JSON topics
const existingTopics = [...new Set(problemsJson.map(p => p.topic))];
console.log('Existing Topics in DB:', existingTopics);

function mapTopic(rawTopic) {
  const t = rawTopic.toLowerCase().trim();
  if (t.includes('arrays & hashing') || t.includes('strings')) return 'Arrays & Hashing';
  if (t.includes('two pointers')) return 'Two Pointers';
  if (t.includes('sliding window')) return 'Sliding Window';
  if (t.includes('stack') || t.includes('queue')) return 'Stack & Queue';
  if (t.includes('binary search')) return 'Binary Search';
  if (t.includes('linked list')) return 'Linked List';
  if (t.includes('tree') || t.includes('bst')) return 'Binary Trees & BST';
  if (t.includes('heap') || t.includes('priority queue')) return 'Heap & Priority Queue';
  if (t.includes('backtracking')) return 'Backtracking';
  if (t.includes('graph') || t.includes('union find')) return 'Graphs';
  if (t.includes('dynamic programming') || t.includes('dp')) return 'Dynamic Programming';
  if (t.includes('greedy')) return 'Greedy & Intervals';
  if (t.includes('intervals')) return 'Greedy & Intervals';
  if (t.includes('trie')) return 'Trie';
  if (t.includes('bit manipulation')) return 'Bit Manipulation';
  if (t.includes('math') || t.includes('matrix')) return 'Math & Matrix';
  if (t.includes('design')) return 'Math & Matrix'; // or other?
  return 'Math & Matrix'; // default fallback
}

// Map parsed problems to final topics
parsedProblems.forEach(p => {
  p.topic = mapTopic(p.topic);
});

const existingTitles = problemsJson.map(p => p.title.toLowerCase().replace(/[^a-z0-9]/g, ''));

let addedCount = 0;
let dupeCount = 0;

const addedList = [];

for (const p of parsedProblems) {
  const normalizedTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Custom checks for common variations
  const isDuplicate = existingTitles.some(t => {
    return t === normalizedTitle || t.includes(normalizedTitle) || normalizedTitle.includes(t);
  });
  
  if (isDuplicate) {
    dupeCount++;
  } else {
    // Add new problem
    const newProb = {
      title: p.title,
      difficulty: 'Medium', // default
      topic: p.topic,
      priority: 'P2',
      pattern: '',
      mlBoost: false,
      companies: '',
      notes: 'Added from raw list 3',
      url: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(p.title)}`
    };
    
    // Add some common priorities/difficulties if we can guess
    const lower = p.title.toLowerCase();
    if (lower.includes('two sum') || lower.includes('contains duplicate') || lower.includes('valid anagram') || lower.includes('reverse string') || lower.includes('merge two sorted lists') || lower.includes('invert binary tree') || lower.includes('same tree') || lower.includes('climbing stairs') || lower.includes('single number')) {
      newProb.difficulty = 'Easy';
      newProb.priority = 'P0';
    }
    
    problemsJson.push(newProb);
    existingTitles.push(normalizedTitle); // avoid adding duplicates from the new list itself
    addedList.push(p.title);
    addedCount++;
  }
}

fs.writeFileSync('src/data/problems.json', JSON.stringify(problemsJson, null, 2));

console.log(`Parsed total: ${parsedProblems.length}`);
console.log(`Duplicates skipped: ${dupeCount}`);
console.log(`Successfully added: ${addedCount}`);
if (addedCount > 0) {
  console.log('Added:', addedList.join(', '));
}
