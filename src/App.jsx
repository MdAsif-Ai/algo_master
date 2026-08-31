import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import RoadmapView from './components/RoadmapView';
import ProblemModal from './components/ProblemModal';
import { useLocalStorage } from './hooks/useLocalStorage';

// Since we migrated the script that attached to window, we will just fetch the JSON.
// In a real app we'd import the JSON directly or fetch it.
import problemsData from './data/problems.json';

// Define modules in the user's exact ordered curriculum
const MODULES = [
  { id: 1, name: "Arrays & Hashing" },
  { id: 2, name: "Two Pointers" },
  { id: 3, name: "Sliding Window" },
  { id: 4, name: "Stack & Queue" },
  { id: 5, name: "Binary Search" },
  { id: 6, name: "Linked List" },
  { id: 7, name: "Recursion & Backtracking" },
  { id: 8, name: "Binary Trees" },
  { id: 9, name: "Binary Search Trees (BST)" },
  { id: 10, name: "Heap & Priority Queue" },
  { id: 11, name: "Trie" },
  { id: 12, name: "Graphs" },
  { id: 13, name: "Greedy & Intervals" },
  { id: 14, name: "Dynamic Programming" },
  { id: 15, name: "Bit Manipulation" },
  { id: 16, name: "Math & Matrix" }
];

function App() {
  const [problems, setProblems] = useState([]);
  
  // State for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priority: [],
    difficulty: [],
    unsolvedOnly: false,
    mlBoostOnly: false,
    starredOnly: false
  });

  // Persistent State
  const [solvedState, setSolvedState] = useLocalStorage('algomaster_solved', {});
  const [starredState, setStarredState] = useLocalStorage('algomaster_starred', {});
  const [notesState, setNotesState] = useLocalStorage('algomaster_notes', {});
  const [codeState, setCodeState] = useLocalStorage('algomaster_code', {}); // New Feature

  const [activeProblem, setActiveProblem] = useState(null);

  // Initialize data
  useEffect(() => {
    // Inject IDs and ModuleIds based on topic
    const moduleMap = {};
    MODULES.forEach(m => moduleMap[m.name] = m.id);

    const enriched = problemsData.map((p, index) => {
      const t = p.topic || 'Other';
      const modId = moduleMap[t];
      
      return {
        ...p,
        id: `prob_${index}`,
        ModuleId: modId,
        Topic: t,
        Problem: p.title,
        Difficulty: p.difficulty,
        Priority: p.priority,
        "ML Boost": p.mlBoost ? "★" : "",
        Pattern: p.pattern,
        Companies: Array.isArray(p.companies) ? p.companies.join(", ") : p.companies,
        Notes: p.notes,
        Link: p.url
      };
    });
    setProblems(enriched);
  }, []);

  const handleToggleSolved = (id) => {
    setSolvedState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleStar = (id) => {
    setStarredState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSaveNotes = (id, notes) => {
    setNotesState(prev => ({
      ...prev,
      [id]: notes
    }));
  };

  const handleSaveCode = (id, code) => {
    setCodeState(prev => ({
      ...prev,
      [id]: code
    }));
  };

  const handleExport = () => {
    const data = {
      solved: solvedState,
      starred: starredState,
      notes: notesState,
      code: codeState
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algomaster_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.solved) setSolvedState(data.solved);
        if (data.starred) setStarredState(data.starred);
        if (data.notes) setNotesState(data.notes);
        if (data.code) setCodeState(data.code);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Compute derived state for Sidebar
  const solvedSet = new Set(Object.keys(solvedState).filter(k => solvedState[k]));
  const starredSet = new Set(Object.keys(starredState).filter(k => starredState[k]));
  
  const moduleStats = MODULES.map(m => {
    const modProbs = problems.filter(p => p.ModuleId === m.id);
    const modSolved = modProbs.filter(p => solvedSet.has(p.id)).length;
    return {
      id: m.id,
      name: m.name,
      total: modProbs.length,
      solved: modSolved
    };
  });

  return (
    <div className="app-container">
      <Sidebar 
        moduleStats={moduleStats} 
        totalProblems={problems.length}
        totalSolved={solvedSet.size}
      />
      
      <main className="main-content">
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExport={handleExport}
          onImport={handleImport}
        />
        
        <FilterBar 
          filters={filters}
          setFilters={setFilters}
        />
        
        <RoadmapView 
          modules={MODULES}
          problems={problems}
          filters={{...filters, searchQuery, starredSet}}
          solvedSet={solvedSet}
          onToggleSolved={handleToggleSolved}
          onProblemClick={setActiveProblem}
        />
      </main>

      <ProblemModal 
        problem={activeProblem}
        onClose={() => setActiveProblem(null)}
        savedNotes={activeProblem ? notesState[activeProblem.id] : ''}
        savedCode={activeProblem ? codeState[activeProblem.id] : ''}
        isStarred={activeProblem ? starredSet.has(activeProblem.id) : false}
        onSaveNotes={handleSaveNotes}
        onSaveCode={handleSaveCode}
        onToggleStar={handleToggleStar}
      />
    </div>
  );
}

export default App;
