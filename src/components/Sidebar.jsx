import React from 'react';

export default function Sidebar({ moduleStats, totalProblems, totalSolved }) {
  const percentage = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Algomaster</h2>
        <p style={{ fontSize: '0.875rem' }}>FAANG Tracker</p>
      </div>

      <div className="progress-widget">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Overall Progress</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-color)' }}>{percentage}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {totalSolved} / {totalProblems} Problems Solved
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Modules</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {moduleStats.map(mod => (
            <a href={`#module-${mod.id}`} key={mod.id} className="nav-item">
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {mod.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {mod.solved}/{mod.total}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
