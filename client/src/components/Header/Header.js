import React from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { toggleFilterDrawer } from '../../features/filters/filtersSlice'; // Import the action
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();

  const handleToggleFilter = () => {
    dispatch(toggleFilterDrawer());
  };

  return (
    <header className="header">
      <div className="header-title">Inventory Dashboard (Admin Dashboard)</div>
      <div className="admin-console">
        <span className="admin-icon">🔧</span>
        <span>Admin Console</span>
        <span className="admin-tag">ONLINE</span>
      </div>
      <div className="header-actions">
        <button className="support-btn">
          <span>🔄</span> Support
        </button>
        {/* Add Filter Toggle Button */}
        <button className="filter-toggle-btn" onClick={handleToggleFilter}>
           FILTER DATA BY
        </button>
        <div className="user-profile">
          <div className="user-avatar">J</div>
          {/* Consider making the dropdown functional later if needed */}
          <span className="dropdown-icon">▼</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
