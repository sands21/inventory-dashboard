import React from 'react';
import { useSelector } from 'react-redux'; 
import Header from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import FilterPanel from './components/Filter/FilterPanel';
import './App.css';

function App() {
  // Get the drawer open state from Redux
  const isFilterPanelOpen = useSelector(state => state.filters.drawerOpen);

  return (
    <div className="app">
      <Header />
      {/* Add class based on filter panel state */}
      <main className={`main-content ${isFilterPanelOpen ? 'filter-panel-open' : ''}`}>
        <div className="dashboard-container"> {/* Wrap dashboard content */}
          <Dashboard />
        </div>
        <div className="filter-panel-container"> {/* Wrap filter panel */}
           <FilterPanel />
        </div>
      </main>
    </div>
  );
}

export default App;
