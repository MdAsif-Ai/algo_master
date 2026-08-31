import React from 'react';

export default function Header({ searchQuery, setSearchQuery, onExport, onImport }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <header className="top-header">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search problems by name, pattern, or company..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="header-actions">
        <button className="btn btn-outline" onClick={onExport}>
          Export Backup
        </button>
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          Import Backup
          <input 
            type="file" 
            accept=".json" 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
          />
        </label>
      </div>
    </header>
  );
}
