const fs = require('fs');

const rawText = fs.readFileSync('user_ordered_list.txt', 'utf8');
const problemsJson = JSON.parse(fs.readFileSync('src/data/problems.json', 'utf8'));

const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

// We define our 16 target topics exactly:
const TOPIC_ORDER = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack & Queue",
  "Binary Search",
  "Linked List",
  "Recursion & Backtracking",
  "Binary Trees",
  "Binary Search Trees (BST)",
  "Heap & Priority Queue",
  "Trie",
  "Graphs",
  "Greedy & Intervals",
  "Dynamic Programming",
  "Bit Manipulation",
  "Math & Matrix"
];

// Map headers to normalized topics
function getTopicName(header) {
  const h = header.toLowerCase().trim();
  if (h.includes('arrays & hashing')) return 'Arrays & Hashing';
  if (h.includes('two pointers')) return 'Two Pointers';
  if (h.includes('sliding window')) return 'Sliding Window';
  if (h.includes('stack & queue')) return 'Stack & Queue';
  if (h.includes('binary search trees')) return 'Binary Search Trees (BST)';
  if (h.includes('binary trees')) return 'Binary Trees';
  if (h.includes('binary search')) return 'Binary Search';
  if (h.includes('linked list')) return 'Linked List';
  if (h.includes('recursion & backtracking')) return 'Recursion & Backtracking';
  if (h.includes('heap & priority queue')) return 'Heap & Priority Queue';
  if (h.includes('trie')) return 'Trie';
  if (h.includes('graphs')) return 'Graphs';
  if (h.includes('greedy & intervals')) return 'Greedy & Intervals';
  if (h.includes('dynamic programming')) return 'Dynamic Programming';
  if (h.includes('bit manipulation')) return 'Bit Manipulation';
  if (h.includes('math & matrix')) return 'Math & Matrix';
  return null;
}

// Custom manual overrides for fuzzy matching
const titleMapping = {
  "kadane's algorithm / maximum subarray": "kadane's algorithm",
  "sort colors (dutch national flag)": "sort colors",
  "sort an array of 0's 1's and 2's": "sort colors",
  "trapping rainwater": "trapping rain water",
  "find the repeating and missing number": "find the repeating and missing number",
  "inversion of array (merge sort)": "inversion of array (merge sort)",
  "inversion of array (pre-req: merge sort)": "inversion of array (merge sort)",
  "two sum ii input array is sorted": "two sum ii (sorted)",
  "two sum ii – input array is sorted": "two sum ii (sorted)",
  "sum of two integers (bit-related, fits here conceptually too — see bit manipulation)": "sum of two integers",
  "climbing stairs": "climbing stairs",
  "morris inorder traversal": "morris inorder traversal",
  "morris preorder traversal": "morris preorder traversal",
  "populating next right pointers in each node": "populating next right pointers in each node",
  "morris preorder traversal": "morris preorder traversal",
  "morris inorder traversal": "morris inorder traversal",
  "pow(x, n)": "pow(x, n)",
  "pow(x n)": "pow(x, n)",
};

let currentTopic = '';
const orderedList = []; // Array of { title, topic }

const subHeaders = ['1d dp', 'grid dp', 'knapsack family', 'string dp', 'partition / mcm family', 'stock dp', 'misc dp'];

for (const line of lines) {
  const normLine = line.toLowerCase().trim();
  
  // Is it a major topic?
  const matchedTopic = getTopicName(line);
  if (matchedTopic) {
    currentTopic = matchedTopic;
    continue;
  }
  
  // Skip minor subheaders inside DP
  if (subHeaders.includes(normLine)) {
    continue;
  }
  
  // It's a problem title
  if (currentTopic) {
    orderedList.push({
      title: line,
      topic: currentTopic
    });
  }
}

console.log(`Parsed ${orderedList.length} problems from ordered list.`);

// Match with existing data
const existingProblems = [...problemsJson];
const matchedProblems = [];
const usedIndexes = new Set();

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

for (const item of orderedList) {
  const normTitle = normalize(item.title);
  const mappedName = titleMapping[item.title.toLowerCase().trim()];
  const normMappedName = mappedName ? normalize(mappedName) : null;
  
  let foundIndex = -1;
  
  // Try exact or mapped match first
  for (let i = 0; i < existingProblems.length; i++) {
    if (usedIndexes.has(i)) continue;
    const title = normalize(existingProblems[i].title);
    if (title === normTitle || (normMappedName && title === normMappedName)) {
      foundIndex = i;
      break;
    }
  }
  
  // Try partial match if not found
  if (foundIndex === -1) {
    for (let i = 0; i < existingProblems.length; i++) {
      if (usedIndexes.has(i)) continue;
      const title = normalize(existingProblems[i].title);
      if (title.includes(normTitle) || normTitle.includes(title)) {
        foundIndex = i;
        break;
      }
    }
  }
  
  if (foundIndex !== -1) {
    // Found existing! Use it and update its topic
    const matched = { ...existingProblems[foundIndex], topic: item.topic };
    matchedProblems.push(matched);
    usedIndexes.add(foundIndex);
  } else {
    // Truly new problem - create it!
    const newProb = {
      title: item.title,
      difficulty: "Medium",
      topic: item.topic,
      priority: "P2",
      pattern: "",
      mlBoost: false,
      companies: "",
      notes: "Added in custom order mapping",
      url: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(item.title)}`
    };
    // Easy default checks
    const l = item.title.toLowerCase();
    if (l.includes('two sum') || l.includes('contains duplicate') || l.includes('valid anagram') || l.includes('reverse string') || l.includes('climbing stairs')) {
      newProb.difficulty = 'Easy';
      newProb.priority = 'P0';
    }
    matchedProblems.push(newProb);
  }
}

// Now handle the leftover problems from existing DB that weren't in the ordered list
const leftoverProblems = [];
for (let i = 0; i < existingProblems.length; i++) {
  if (!usedIndexes.has(i)) {
    leftoverProblems.push(existingProblems[i]);
  }
}

console.log(`Matched: ${usedIndexes.size}`);
console.log(`Created new: ${matchedProblems.length - usedIndexes.size}`);
console.log(`Leftovers (placed at the end of their topics): ${leftoverProblems.length}`);

// We will construct the final sorted array.
// For each target topic, we take the matched ones (which are in the user's exact order), 
// and then append any leftover problems of that topic at the end.
const finalProblemsList = [];

TOPIC_ORDER.forEach(topic => {
  // Add matched problems of this topic
  const matched = matchedProblems.filter(p => p.topic === topic);
  finalProblemsList.push(...matched);
  
  // Add leftovers of this topic (or mapped topic)
  const leftovers = leftoverProblems.filter(p => {
    // Map leftover topics to TOPIC_ORDER name conventions
    let t = p.topic || 'Math & Matrix';
    if (t === 'Stack & Queue') {
      if (topic === 'Stack & Queue') return true;
    } else if (t === 'Binary Trees & BST') {
      // Split leftovers into Binary Trees or BST. We can put them in Binary Trees as default
      if (topic === 'Binary Trees') return true;
    } else if (t === 'Trie' && topic === 'Trie') {
      return true;
    } else if (t === topic) {
      return true;
    }
    return false;
  });
  
  finalProblemsList.push(...leftovers);
});

// Any remaining leftovers that didn't match any topic in TOPIC_ORDER go into Math & Matrix
const remainingLeftovers = leftoverProblems.filter(p => {
  const inList = finalProblemsList.some(fp => fp.title === p.title);
  return !inList;
});

finalProblemsList.push(...remainingLeftovers);

fs.writeFileSync('src/data/problems.json', JSON.stringify(finalProblemsList, null, 2));
console.log(`Successfully rewrote problems.json with ${finalProblemsList.length} problems sorted in the requested order.`);
