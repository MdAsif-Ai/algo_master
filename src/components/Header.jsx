import React from 'react';

export default function Header({ searchQuery, setSearchQuery, onExport, user, onLogout, dataLoading }) {
  // Get initials from email for avatar
  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
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
        {/* Cloud sync indicator */}
        {dataLoading && (
          <span className="sync-indicator">
            <span className="sync-dot syncing"></span>
            Syncing...
          </span>
        )}

        <button className="btn btn-outline" onClick={onExport} title="Download a JSON backup of all your progress">
          ↓ Export Backup
        </button>

        {/* User info + logout */}
        {user && (
          <div className="user-menu">
            <div className="user-avatar" title={user.email}>
              {getInitials(user.email)}
            </div>
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <span className="cloud-badge">☁ Cloud Saved</span>
            </div>
            <button className="btn btn-logout" onClick={onLogout} title="Sign out">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
