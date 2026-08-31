const fs = require('fs');

const userList = fs.readFileSync('user_problems.txt', 'utf8');
const problemsJson = JSON.parse(fs.readFileSync('src/data/problems.json', 'utf8'));

// Extract problem titles from user list
const userLines = userList.split('\n').filter(line => line.trim().length > 0 && line.includes('—'));

const toAdd = [];
const existingTitles = problemsJson.map(p => p.title.toLowerCase().trim());

const nameMap = {
  "add two numbers (linked list)": "add two numbers",
  "binary tree inorder traversal": "inorder traversal",
  "symmetric tree": "symmetric binary tree",
  "path sum (root-to-leaf)": "path sum",
  "lowest common ancestor of bst": "lca in bst",
  "lowest common ancestor of binary tree": "lca in bt", // maybe?
  "populating next right pointers (each node)": "populating next right pointers in each node",
  "peak element": "find peak element",
  "word ladder i": "word ladder",
  "design lru cache": "lru cache",
  "design hashmap": "design hashmap"
};

let missingCount = 0;
const newlyAdded = [];

userLines.forEach(line => {
  const parts = line.split('—');
  let rawName = parts[0].trim();
  const lowerName = rawName.toLowerCase();
  
  // Check if it exists exactly or through mapping
  let searchName = nameMap[lowerName] || lowerName;
  
  const exists = existingTitles.some(t => t === searchName || t.includes(searchName) || searchName.includes(t));
  
  if (!exists) {
    missingCount++;
    console.log("Missing:", rawName);
    
    // Create new problem object
    const newProb = {
      title: rawName,
      difficulty: "Medium", // Defaulting, user didn't specify in this text block, though we could extract it from leetcode or previous list
      topic: "Other", // Will need to classify
      priority: "P2",
      pattern: "",
      mlBoost: false,
      companies: "",
      notes: "Added from user list",
      url: parts[1] && parts[1].includes("(") ? parts[1].match(/\((.*?)\)/)[1] : ""
    };
    
    // basic classification
    const l = lowerName;
    if (l.includes("pow") || l.includes("number") || l.includes("rectangle")) newProb.topic = "Math & Matrix";
    if (l.includes("ladder")) newProb.topic = "Graphs";
    if (l.includes("parentheses")) newProb.topic = "Stack & Queue";
    
    problemsJson.push(newProb);
    newlyAdded.push(rawName);
  }
});

fs.writeFileSync('src/data/problems.json', JSON.stringify(problemsJson, null, 2));

console.log(`\nTotal found in user text: ${userLines.length}`);
console.log(`Truly missing and added: ${newlyAdded.length}`);
if (newlyAdded.length > 0) {
  console.log(newlyAdded.join(", "));
}
