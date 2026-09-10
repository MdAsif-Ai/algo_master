const fs = require('fs');

const problems = JSON.parse(fs.readFileSync('./src/data/problems.json', 'utf8'));

// Full 21-week curriculum
const curriculum = [
  // Week 1: Maths & Combinatorics
  { title: "Divisible by 13", topic: "Math & Matrix" },
  { title: "Nine Divisors", topic: "Math & Matrix" },
  { title: "Power of k in N!", topic: "Math & Matrix" },
  { title: "LCM Triplet", topic: "Math & Matrix" },
  { title: "Unique Vowels String Arrangement", topic: "Math & Matrix" },
  { title: "Must Have Digit", topic: "Math & Matrix" },
  { title: "Count Coprime Pairs", topic: "Math & Matrix" },

  // Week 2: Arrays 1D & 2D
  { title: "Smallest Positive Missing", topic: "Arrays & Hashing" },
  { title: "Sum of all subarrays", topic: "Arrays & Hashing" },
  { title: "Last Moment Before All Ants Fall Out", topic: "Arrays & Hashing" },
  { title: "Max Circular Subarray Sum", topic: "Arrays & Hashing" },
  { title: "Majority Element 2", topic: "Arrays & Hashing" },
  { title: "Set Matrix Zeros", topic: "Arrays & Hashing" },
  { title: "Make Row and Col Sum Equal", topic: "Arrays & Hashing" },

  // Week 3: Hashing & Prefix Sums
  { title: "Sum of Ascii", topic: "Arrays & Hashing" },
  { title: "Number of Subarrays Having Sum K", topic: "Arrays & Hashing" },
  { title: "Powerful Integer", topic: "Arrays & Hashing" },
  { title: "Balance Vowel Consonant Ratio", topic: "Arrays & Hashing" },
  { title: "Longest Subarray With Majority Greater Than K", topic: "Arrays & Hashing" },
  { title: "2-D Difference Array", topic: "Arrays & Hashing" },
  { title: "Maximum Sum Rectangle", topic: "Arrays & Hashing" },

  // Week 4: Strings
  { title: "Palindrome Sentence", topic: "Arrays & Hashing" },
  { title: "Roman to Integer", topic: "Arrays & Hashing" },
  { title: "Minimum Time Difference", topic: "Arrays & Hashing" },
  { title: "Longest prefix also suffix", topic: "Arrays & Hashing" },
  { title: "Longest Periodic Proper Prefix", topic: "Arrays & Hashing" },
  { title: "Palindrome Substring Count", topic: "Arrays & Hashing" },
  { title: "Maximum Non-Overlapping Palindrome", topic: "Arrays & Hashing" },

  // Week 5: Sorting
  { title: "Shop in Candy Store", topic: "Greedy & Intervals" },
  { title: "Tywin's War Strategy", topic: "Greedy & Intervals" },
  { title: "Count Reverse Pairs", topic: "Arrays & Hashing" },
  { title: "Insert Interval", topic: "Greedy & Intervals" },
  { title: "Form the Largest Number", topic: "Greedy & Intervals" },
  { title: "Sort by Absolute Difference", topic: "Arrays & Hashing" },
  { title: "Find H-Index", topic: "Arrays & Hashing" },

  // Week 6: Searching
  { title: "Farthest Smaller Right", topic: "Binary Search" },
  { title: "Search in Rotated sorted 2D matrix", topic: "Binary Search" },
  { title: "Maximize Minimum Difference Between k Elements", topic: "Binary Search" },
  { title: "Sorted Matrix Median", topic: "Binary Search" },
  { title: "Allocate Minimum Pages", topic: "Binary Search" },
  { title: "Minimum Days For M bouquets", topic: "Binary Search" },
  { title: "Maximize Median After k Operations", topic: "Binary Search" },

  // Week 7: Two Pointers & Sliding Window
  { title: "Check subsequence of a string", topic: "Two Pointers" },
  { title: "Count Possible Triangles", topic: "Two Pointers" },
  { title: "Max Consecutive 1s after at most k flips", topic: "Sliding Window" },
  { title: "Smallest window containing all characters", topic: "Sliding Window" },
  { title: "The Celebrity Problem", topic: "Two Pointers" },
  { title: "Container with Most Water", topic: "Two Pointers" },
  { title: "Sliding window Mode", topic: "Sliding Window" },

  // Week 8: Linked List
  { title: "Swap Kth nodes from ends", topic: "Linked List" },
  { title: "Reverse a Doubly Linked List", topic: "Linked List" },
  { title: "Reverse in groups", topic: "Linked List" },
  { title: "Sort a linked list of 0s, 1s and 2s", topic: "Linked List" },
  { title: "Find length of Loop", topic: "Linked List" },
  { title: "Merge K sorted linked lists", topic: "Linked List" },
  { title: "Merge Sort for Linked List", topic: "Linked List" },

  // Week 9: Greedy
  { title: "Assign Mice Holes", topic: "Greedy & Intervals" },
  { title: "Largest number in one swap", topic: "Greedy & Intervals" },
  { title: "Minimum Jumps", topic: "Greedy & Intervals" },
  { title: "Minimize the Heights II", topic: "Greedy & Intervals" },
  { title: "Minimum Cost to cut a board into squares", topic: "Greedy & Intervals" },
  { title: "Gas Station", topic: "Greedy & Intervals" },
  { title: "String stack", topic: "Stack & Queue" },

  // Week 10: Stacks
  { title: "Postfix Evaluation", topic: "Stack & Queue" },
  { title: "Decode String", topic: "Stack & Queue" },
  { title: "Next Greater in Circular Array", topic: "Stack & Queue" },
  { title: "Minimum Additions for Valid Parentheses", topic: "Stack & Queue" },
  { title: "Longest Subarray length", topic: "Stack & Queue" },
  { title: "Max Rectangle", topic: "Stack & Queue" },
  { title: "Max of Min for Every Window Size", topic: "Stack & Queue" },

  // Week 11: Queue & Deque
  { title: "Reversing Queue", topic: "Stack & Queue" },
  { title: "Deque for Constant-Time Min and Max", topic: "Stack & Queue" },
  { title: "Generate Binary Numbers", topic: "Stack & Queue" },
  { title: "Rotate Deque By K", topic: "Stack & Queue" },
  { title: "Flipping Bits with K-window", topic: "Stack & Queue" },
  { title: "Max-Length Subarray with Bounded Difference", topic: "Sliding Window" },
  { title: "Maximum Subarray Sum 2", topic: "Arrays & Hashing" },

  // Week 12: Recursion & Backtracking
  { title: "Generate all binary strings of length N", topic: "Recursion & Backtracking" },
  { title: "Unique Array Permutations", topic: "Recursion & Backtracking" },
  { title: "Combination sum III", topic: "Recursion & Backtracking" },
  { title: "Phone number", topic: "Recursion & Backtracking" },
  { title: "Expression Add Operator", topic: "Recursion & Backtracking" },
  { title: "Rat in a maze", topic: "Recursion & Backtracking" },
  { title: "Knight Tour", topic: "Recursion & Backtracking" },

  // Week 13: Binary Trees
  { title: "Bottom View of a Binary Tree", topic: "Binary Trees" },
  { title: "Construct Binary Tree from postorder and preorder", topic: "Binary Trees" },
  { title: "Morris traversal for Postorder", topic: "Binary Trees" },
  { title: "ZigZag Tree Traversal", topic: "Binary Trees" },
  { title: "Maximum Path Sum", topic: "Binary Trees" },
  { title: "Distribute Candies", topic: "Binary Trees" },
  { title: "Non-Adjacent Node Sum in Binary Tree", topic: "Binary Trees" },

  // Week 14: Binary Search Tree
  { title: "Sum of BST Nodes in a Given Range", topic: "Binary Search Trees (BST)" },
  { title: "k-th Smallest in BST", topic: "Binary Search Trees (BST)" },
  { title: "Trim BST", topic: "Binary Search Trees (BST)" },
  { title: "Transform a BST to greater sum tree", topic: "Binary Search Trees (BST)" },
  { title: "Find median of BST", topic: "Binary Search Trees (BST)" },
  { title: "K closest Values", topic: "Binary Search Trees (BST)" },
  { title: "Total BST's using array elements", topic: "Binary Search Trees (BST)" },

  // Week 15: Heaps
  { title: "kth frequent element", topic: "Heap & Priority Queue" },
  { title: "Nearly Sorted", topic: "Heap & Priority Queue" },
  { title: "K Closest Points to the Origin", topic: "Heap & Priority Queue" },
  { title: "Consecutive K Subarrays", topic: "Heap & Priority Queue" },
  { title: "Minimum Steps to Halve Sum", topic: "Heap & Priority Queue" },
  { title: "Connect n ropes with minimum cost", topic: "Heap & Priority Queue" },
  { title: "Find K pairs with smallest sums", topic: "Heap & Priority Queue" },

  // Week 16: Graphs I
  { title: "Distance of nearest cell having 1 in a binary matrix", topic: "Graphs" },
  { title: "Diameter of a graph", topic: "Graphs" },
  { title: "O surrounded by X", topic: "Graphs" },
  { title: "Shortest Cycle in a undirected graph", topic: "Graphs" },
  { title: "Course Schedule II", topic: "Graphs" },
  { title: "Maximum edges in DAG", topic: "Graphs" },
  { title: "Eventual Safe States", topic: "Graphs" },

  // Week 17: Dynamic Programming I
  { title: "Frog Jump", topic: "Dynamic Programming" },
  { title: "Get Minimum Squares", topic: "Dynamic Programming" },
  { title: "Tiling problem", topic: "Dynamic Programming" },
  { title: "Weighted Job Scheduling", topic: "Dynamic Programming" },
  { title: "Number of Paths with exactly K coins", topic: "Dynamic Programming" },
  { title: "Chocolate Pickup II", topic: "Dynamic Programming" },
  { title: "Stock Buy and Sell with Cooldown", topic: "Dynamic Programming" },

  // Week 18: Dynamic Programming II
  { title: "Shortest Common Supersequence", topic: "Dynamic Programming" },
  { title: "WildCard Matching", topic: "Dynamic Programming" },
  { title: "Interleaving Strings", topic: "Dynamic Programming" },
  { title: "Minimum Cost to merge Stones", topic: "Dynamic Programming" },
  { title: "Minimum Cost to cut stick", topic: "Dynamic Programming" },
  { title: "Longest Common Increasing Subsequence", topic: "Dynamic Programming" },
  { title: "Maximum Sum Increasing Subsequence", topic: "Dynamic Programming" },

  // Week 19: Graphs II
  { title: "Ways to Reach in Minimum Time", topic: "Graphs" },
  { title: "Path With Minimum Effort", topic: "Graphs" },
  { title: "String Problem", topic: "Graphs" },
  { title: "Shortest path with 1 curve edge", topic: "Graphs" },
  { title: "Minimum Operations to Connect Hospitals", topic: "Graphs" },
  { title: "Maximum Stones Removal", topic: "Graphs" },
  { title: "Second Best MST", topic: "Graphs" },

  // Week 20: Bit Manipulation & Tries
  { title: "Game of XOR", topic: "Bit Manipulation" },
  { title: "AND Operation", topic: "Bit Manipulation" },
  { title: "Sum of XOR of all possible subsets", topic: "Bit Manipulation" },
  { title: "Subset XOR", topic: "Bit Manipulation" },
  { title: "Count Set Bits", topic: "Bit Manipulation" },
  { title: "Count of distinct substrings", topic: "Trie" },
  { title: "XOR Pair Count", topic: "Bit Manipulation" },

  // Week 21: Dynamic Programming III
  { title: "Maximum String Score", topic: "Dynamic Programming" },
  { title: "Travelling Salesman", topic: "Dynamic Programming" },
  { title: "Optimal Binary Search Tree", topic: "Dynamic Programming" },
  { title: "Walls Coloring II", topic: "Dynamic Programming" },
  { title: "Optimal Strategy", topic: "Dynamic Programming" },
  { title: "Number of Distinct Subsequences", topic: "Dynamic Programming" },
  { title: "Brackets in Matrix Chain Multiplication", topic: "Dynamic Programming" },
];

// Normalize for comparison
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const existingNormalized = new Set(problems.map(p => normalize(p.title)));

// Find missing
const missing = [];
const alreadyExists = [];

for (const item of curriculum) {
  const norm = normalize(item.title);
  if (!existingNormalized.has(norm)) {
    missing.push(item);
  } else {
    alreadyExists.push(item.title);
  }
}

console.log(`\n✅ Already exist: ${alreadyExists.length}`);
console.log(`❌ Missing: ${missing.length}`);
console.log('\nMissing problems:');
missing.forEach((p, i) => console.log(`  ${i+1}. [${p.topic}] ${p.title}`));

// --- Add missing to problems.json ---
const maxId = Math.max(...problems.map(p => p.id || 0));
const newProblems = missing.map((p, i) => ({
  id: maxId + i + 1,
  title: p.title,
  slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  url: "",
  topic: p.topic,
  topicOrder: 1,
  difficulty: "Medium",
  priority: "P1",
  pattern: "Problem Solving",
  companies: [],
  mlBoost: false,
  notes: "From 21-week curriculum"
}));

const updated = [...problems, ...newProblems];

// --- Remove duplicates (keep first occurrence by normalized title) ---
const seen = new Set();
const deduped = updated.filter(p => {
  const norm = normalize(p.title);
  if (seen.has(norm)) return false;
  seen.add(norm);
  return true;
});

const removed = updated.length - deduped.length;

fs.writeFileSync('./src/data/problems.json', JSON.stringify(deduped, null, 2));
console.log(`\n🆕 Added: ${newProblems.length} new problems`);
console.log(`🗑️  Removed: ${removed} duplicates`);
console.log(`📦 Final total: ${deduped.length} problems`);
