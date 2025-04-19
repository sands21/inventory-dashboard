import React from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/formatters'; 
import './Dashboard.css';

const RecentData = () => {
  const { summary, status } = useSelector(state => state.inventory);

  if (status === 'loading') {
    return <div className="section recent-data">Loading summary...</div>;
  }

  // Use default values if summary is not yet populated
  const {
    newCount = 0,
    newAvgMsrp = 0, 
    usedAvgMsrp = 0, 
    usedCount = 0,
    totalMsrp = 0,
    avgMsrp = 0, 
    cpoCount = 0,
    cpoAvgMsrp = 0, 
    totalCount = 0 
  } = summary || {};

  return (
    <div className="section">
      <h3 className="section-title">Inventory Summary</h3>

      <div className="metrics-container">
        {/* Card 1: # New Units */}
        <div className="metric-card">
          <div className="metric-value">{newCount}</div>
          <div className="metric-label"># New Units</div>
        </div>

        {/* Card 2: New Avg. MSRP */}
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(newAvgMsrp)}</div>
          <div className="metric-label">New Avg. MSRP</div>
        </div>

        {/* Card 3: Used Avg. MSRP */}
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(usedAvgMsrp)}</div>
          <div className="metric-label">Used Avg. MSRP</div>
        </div>

        {/* Card 4: # Used Units */}
        <div className="metric-card">
          <div className="metric-value">{usedCount}</div>
          <div className="metric-label"># Used Units</div>
        </div>

        {/* Card 5: Total MSRP */}
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(totalMsrp)}</div>
          <div className="metric-label">Total MSRP</div>
        </div>

        {/* Card 6: Total Avg. MSRP */}
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(avgMsrp)}</div>
          <div className="metric-label">Total Avg. MSRP</div>
        </div>

        {/* Card 7: # CPO Units */}
        <div className="metric-card">
          <div className="metric-value">{cpoCount}</div>
          <div className="metric-label"># CPO Units</div>
        </div>

        {/* Card 8: CPO Avg. MSRP */}
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(cpoAvgMsrp)}</div>
          <div className="metric-label">CPO Avg. MSRP</div>
        </div>
      </div>
    </div>
  );
};

export default RecentData;
