const fs = require('fs');

const problems = JSON.parse(fs.readFileSync('./src/data/problems.json', 'utf8'));

// Map topic → topicOrder (module ID from MODULES list)
const topicOrderMap = {
  "Arrays & Hashing": 1,
  "Two Pointers": 2,
  "Sliding Window": 3,
  "Stack & Queue": 4,
  "Binary Search": 5,
  "Linked List": 6,
  "Recursion & Backtracking": 7,
  "Binary Trees": 8,
  "Binary Trees & BST": 8,
  "Binary Search Trees (BST)": 9,
  "Heap & Priority Queue": 10,
  "Trie": 11,
  "Graphs": 12,
  "Greedy & Intervals": 13,
  "Dynamic Programming": 14,
  "Dynamic Programming - Strings": 14,
  "Dynamic Programming - 1D": 14,
  "Bit Manipulation": 15,
  "Math & Matrix": 16,
  "Backtracking": 7,
};

let fixed = 0;
const updated = problems.map(p => {
  const order = topicOrderMap[p.topic];
  if (order !== undefined && p.topicOrder !== order) {
    fixed++;
    return { ...p, topicOrder: order };
  }
  return p;
});

fs.writeFileSync('./src/data/problems.json', JSON.stringify(updated, null, 2));
console.log(`✅ Fixed topicOrder for ${fixed} problems`);
console.log(`📦 Total: ${updated.length} problems`);

// Print topics without a mapped order (unknown topics)
const unmapped = [...new Set(updated.filter(p => !topicOrderMap[p.topic]).map(p => p.topic))];
if (unmapped.length) {
  console.log('\n⚠️  Unmapped topics (will not show in sidebar):');
  unmapped.forEach(t => console.log('  -', t));
}
