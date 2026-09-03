import React, { useState, useEffect, useRef } from 'react';

export default function ProblemModal({
  problem, onClose,
  onSaveNotes, onSaveCode,
  savedNotes, savedCode,
  isStarred, onToggleStar,
  isSolved, onToggleSolved
}) {
  const [activeTab, setActiveTab] = useState('details');
  const [notes, setNotes] = useState(savedNotes || '');
  const [code, setCode] = useState(savedCode || '');
  const [saveStatus, setSaveStatus] = useState(''); // 'saving' | 'saved' | ''

  const notesTimer = useRef(null);
  const codeTimer = useRef(null);

  // Reset local state when problem changes
  useEffect(() => {
    setNotes(savedNotes || '');
    setCode(savedCode || '');
    setActiveTab('details');
    setSaveStatus('');
  }, [problem?.id, savedNotes, savedCode]);

  // Auto-save notes with 1-second debounce
  const handleNotesChange = (value) => {
    setNotes(value);
    setSaveStatus('saving');
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => {
      onSaveNotes(problem.id, value);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  // Auto-save code with 1-second debounce
  const handleCodeChange = (value) => {
    setCode(value);
    setSaveStatus('saving');
    clearTimeout(codeTimer.current);
    codeTimer.current = setTimeout(() => {
      onSaveCode(problem.id, value);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(notesTimer.current);
      clearTimeout(codeTimer.current);
    };
  }, []);

  if (!problem) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {problem.Problem}
              <button
                className={`star-btn ${isStarred ? 'starred' : ''}`}
                onClick={() => onToggleStar(problem.id)}
                title={isStarred ? "Remove Star" : "Star for Review"}
              >
                {isStarred ? '★' : '☆'}
              </button>
            </h2>
            <div className="problem-meta" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className={`badge badge-${problem.Difficulty?.toLowerCase()}`}>{problem.Difficulty}</span>
              <span className={`badge badge-${problem.Priority?.toLowerCase()}`}>{problem.Priority}</span>
              {problem["ML Boost"] === "★" && <span className="badge badge-ml">ML Focus</span>}
              {/* Solved toggle inside modal */}
              <button
                className={`btn ${isSolved ? 'btn-solved' : 'btn-outline'}`}
                style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                onClick={() => onToggleSolved(problem.id)}
              >
                {isSolved ? '✓ Solved' : 'Mark Solved'}
              </button>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="tabs">
            <div className={`tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
              Details & Hints
            </div>
            <div className={`tab ${activeTab === 'solution' ? 'active' : ''}`} onClick={() => setActiveTab('solution')}>
              My Solution
            </div>
            <div className={`tab ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
              Notes
            </div>
          </div>

          {/* Auto-save status indicator (shown in solution/notes tabs) */}
          {(activeTab === 'solution' || activeTab === 'notes') && saveStatus && (
            <div className={`autosave-status ${saveStatus}`}>
              {saveStatus === 'saving' ? '⟳ Auto-saving...' : '✓ Saved to cloud'}
            </div>
          )}

          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="modal-section">
                <h4>Pattern & Approach</h4>
                <p style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {problem.Pattern}
                </p>
                <p>{problem.Notes || "No specific approach notes provided in dataset."}</p>
              </div>

              <div className="modal-section">
                <h4>Complexity</h4>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Time</span>
                    <code>{problem.Time || "O(?)"}</code>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Space</span>
                    <code>{problem.Space || "O(?)"}</code>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h4>Companies</h4>
                <p>{problem.Companies || "Common across top tech"}</p>
              </div>

              <div className="modal-section">
                <h4>Links</h4>
                {problem.Link ? (
                  <a href={problem.Link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                    Solve on LeetCode ↗
                  </a>
                ) : (
                  <a href={`https://leetcode.com/problemset/all/?search=${encodeURIComponent(problem.Problem)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex' }}>
                    Search on LeetCode ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'solution' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                Paste your accepted solution code here. It auto-saves to the cloud as you type.
              </p>
              <textarea
                className="code-editor"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="// Paste your Python/C++/Java code here..."
                style={{ flex: 1 }}
              />
            </div>
          )}

          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                Add personal notes, edge cases you missed, or intuition here. Auto-saves to the cloud.
              </p>
              <textarea
                className="notes-editor"
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="E.g., Don't forget to handle integer overflow when..."
                style={{ flex: 1 }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
