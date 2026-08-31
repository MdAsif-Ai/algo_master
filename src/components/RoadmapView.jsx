import React from 'react';

export default function RoadmapView({ modules, problems, filters, onProblemClick, solvedSet, onToggleSolved }) {
  // Apply filters
  const getFilteredProblems = () => {
    return problems.filter(p => {
      // Priority
      if (filters.priority.length > 0 && !filters.priority.includes(p.Priority)) return false;
      // Difficulty
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(p.Difficulty)) return false;
      // Status
      if (filters.unsolvedOnly && solvedSet.has(p.id)) return false;
      if (filters.mlBoostOnly && p["ML Boost"] !== "★") return false;
      // Starred is handled at the App level to filter out non-starred, but let's pass it here
      if (filters.starredOnly && !filters.starredSet.has(p.id)) return false;
      
      // Search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = p.Problem.toLowerCase().includes(query);
        const matchesPattern = (p.Pattern || "").toLowerCase().includes(query);
        const matchesCompany = (p.Companies || "").toLowerCase().includes(query);
        if (!matchesName && !matchesPattern && !matchesCompany) return false;
      }
      
      return true;
    });
  };

  const filtered = getFilteredProblems();
  
  // Group filtered problems back into modules
  const filteredByModule = {};
  filtered.forEach(p => {
    if (!filteredByModule[p.ModuleId]) {
      filteredByModule[p.ModuleId] = [];
    }
    filteredByModule[p.ModuleId].push(p);
  });

  return (
    <div className="roadmap-container">
      {modules.map(mod => {
        const modProblems = filteredByModule[mod.id] || [];
        if (modProblems.length === 0) return null; // hide empty modules

        return (
          <section key={mod.id} id={`module-${mod.id}`} className="module-section">
            <div className="module-header">
              <h3>{mod.id}. {mod.name}</h3>
              <div className="module-stats">
                {modProblems.filter(p => solvedSet.has(p.id)).length} / {modProblems.length} Completed
              </div>
            </div>
            
            <div className="problem-list">
              {modProblems.map(p => {
                const isSolved = solvedSet.has(p.id);
                const isStarred = filters.starredSet.has(p.id);
                
                return (
                  <div 
                    key={p.id} 
                    className="problem-item"
                    onClick={() => onProblemClick(p)}
                  >
                    <div 
                      className={`status-checkbox ${isSolved ? 'checked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSolved(p.id);
                      }}
                    >
                      {isSolved && '✓'}
                    </div>
                    
                    <div className="problem-title">
                      {p.Problem}
                      {isStarred && <span style={{ color: 'var(--warning)' }}>★</span>}
                      {p["ML Boost"] === "★" && <span className="badge badge-ml">ML</span>}
                    </div>
                    
                    <div>
                      <span className={`badge badge-${p.Difficulty.toLowerCase()}`}>{p.Difficulty}</span>
                    </div>
                    
                    <div>
                      <span className={`badge badge-${p.Priority.toLowerCase()}`}>{p.Priority}</span>
                    </div>
                    
                    <div style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                      {p.Pattern}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <h3>No problems match your criteria.</h3>
          <p style={{ marginTop: '0.5rem' }}>Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
