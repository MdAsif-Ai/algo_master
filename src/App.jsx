import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import RoadmapView from './components/RoadmapView';
import ProblemModal from './components/ProblemModal';
import AuthModal from './components/AuthModal';
import { supabase } from './lib/supabase';
import { useSupabaseData } from './hooks/useSupabaseData';

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
  // ─── Auth State ─────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ─── Problem Data ────────────────────────────────────────────────────────
  const [problems, setProblems] = useState([]);

  // ─── Filtering State ─────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priority: [],
    difficulty: [],
    unsolvedOnly: false,
    mlBoostOnly: false,
    starredOnly: false
  });

  const [activeProblem, setActiveProblem] = useState(null);

  // ─── Supabase Cloud Data ─────────────────────────────────────────────────
  const {
    solvedState,
    starredState,
    notesState,
    codeState,
    loading: dataLoading,
    toggleSolved,
    toggleStarred,
    saveCode,
    saveNotes,
  } = useSupabaseData(user?.id);

  // ─── Auth Listener ────────────────────────────────────────────────────────
  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── Initialize Problem List ──────────────────────────────────────────────
  useEffect(() => {
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

  // ─── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ─── Export Backup ────────────────────────────────────────────────────────
  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      userEmail: user?.email,
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

  // ─── Derived Sets ─────────────────────────────────────────────────────────
  const solvedSet = new Set(Object.keys(solvedState).filter(k => solvedState[k]));
  const starredSet = new Set(Object.keys(starredState).filter(k => starredState[k]));

  const moduleStats = MODULES.map(m => {
    const modProbs = problems.filter(p => p.ModuleId === m.id);
    const modSolved = modProbs.filter(p => solvedSet.has(p.id)).length;
    return { id: m.id, name: m.name, total: modProbs.length, solved: modSolved };
  });

  // ─── Show Auth Modal if not logged in ─────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1.25rem', color: '#6b7280'
      }}>
        Loading AlgoMaster...
      </div>
    );
  }

  if (!user) {
    return <AuthModal onAuthSuccess={(user) => setUser(user)} />;
  }

  // ─── Main App ─────────────────────────────────────────────────────────────
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
          user={user}
          onLogout={handleLogout}
          dataLoading={dataLoading}
        />

        <FilterBar
          filters={filters}
          setFilters={setFilters}
        />

        <RoadmapView
          modules={MODULES}
          problems={problems}
          filters={{ ...filters, searchQuery, starredSet }}
          solvedSet={solvedSet}
          onToggleSolved={toggleSolved}
          onProblemClick={setActiveProblem}
        />
      </main>

      <ProblemModal
        problem={activeProblem}
        onClose={() => setActiveProblem(null)}
        savedNotes={activeProblem ? notesState[activeProblem.id] || '' : ''}
        savedCode={activeProblem ? codeState[activeProblem.id] || '' : ''}
        isStarred={activeProblem ? starredSet.has(activeProblem.id) : false}
        onSaveNotes={saveNotes}
        onSaveCode={saveCode}
        onToggleStar={toggleStarred}
        isSolved={activeProblem ? solvedSet.has(activeProblem.id) : false}
        onToggleSolved={toggleSolved}
      />
    </div>
  );
}

export default App;
