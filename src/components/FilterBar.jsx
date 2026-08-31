import React from 'react';

const PRIORITIES = ['P0', 'P1', 'P2'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function FilterBar({ filters, setFilters }) {
  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      }
      return { ...prev, [category]: [...current, value] };
    });
  };

  const toggleBoolean = (category) => {
    setFilters(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">Priority</span>
        <div className="filter-options">
          {PRIORITIES.map(p => (
            <button
              key={p}
              className={`chip ${filters.priority.includes(p) ? 'active' : ''}`}
              onClick={() => toggleFilter('priority', p)}
            >
              {p === 'P0' ? 'P0 (Must Do)' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">Difficulty</span>
        <div className="filter-options">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className={`chip ${filters.difficulty.includes(d) ? 'active' : ''}`}
              onClick={() => toggleFilter('difficulty', d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">Status & Attributes</span>
        <div className="filter-options">
          <button
            className={`chip ${filters.unsolvedOnly ? 'active' : ''}`}
            onClick={() => toggleBoolean('unsolvedOnly')}
          >
            Unsolved Only
          </button>
          <button
            className={`chip ${filters.mlBoostOnly ? 'active' : ''}`}
            onClick={() => toggleBoolean('mlBoostOnly')}
          >
            ★ ML Boost Only
          </button>
          <button
            className={`chip ${filters.starredOnly ? 'active' : ''}`}
            onClick={() => toggleBoolean('starredOnly')}
          >
            Starred ⭐
          </button>
        </div>
      </div>
      
      <div className="filter-group" style={{ marginLeft: 'auto', justifyContent: 'center' }}>
        <button 
          className="btn btn-outline" 
          onClick={() => setFilters({ priority: [], difficulty: [], unsolvedOnly: false, mlBoostOnly: false, starredOnly: false })}
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
