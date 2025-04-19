import React, { useState } from 'react'; 
import { useSelector } from 'react-redux';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './Dashboard.css';

const HistoryLog = () => {
  const { historyLog, status } = useSelector(state => state.inventory);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 

  // Calculate pagination variables
  const totalItems = historyLog.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems); 
  const currentItems = historyLog.slice(startIndex, endIndex);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (status === 'loading') {
    return <div className="section">Loading history log...</div>;
  }
  
  return (
    <div className="section">
      <h3 className="section-title">History Log</h3>
      
      <div className="table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>NEW INVENTORY</th>
              <th>NEW TOTAL MSRP</th>
              <th>NEW AVERAGE MSRP</th>
              <th>USED INVENTORY</th>
              <th>USED TOTAL MSRP</th>
              <th>USED AVERAGE MSRP</th>
              <th>CPO INVENTORY</th>
              <th>CPO TOTAL MSRP</th>
              <th>CPO AVERAGE MSRP</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0
              ? currentItems.map((entry, index) => (
                  <tr key={entry.date || startIndex + index}><td>{formatDate(entry.date)}</td><td>{entry.NEW.count}</td><td>{formatCurrency(entry.NEW.totalMSRP)}</td><td>{formatCurrency(entry.NEW.avgMSRP)}</td><td>{entry.USED.count}</td><td>{formatCurrency(entry.USED.totalMSRP)}</td><td>{formatCurrency(entry.USED.avgMSRP)}</td><td>{entry.CPO.count}</td><td>{formatCurrency(entry.CPO.totalMSRP)}</td><td>{formatCurrency(entry.CPO.avgMSRP)}</td></tr> 
                ))
              : ( 
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>No history data available for the selected filters.</td>
                  </tr>
                )
            }
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {totalItems > 0 && (
        <div className="pagination">
          <span>Rows per page: {itemsPerPage}</span>
          <div className="page-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              {'<'} 
            </button>
            {/* Page Info */}
            <span>
              
              {totalItems > 0 ? `${startIndex + 1}-${endIndex}` : '0'} of {totalItems}
            </span>
            {/* Next Button */}
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              {'>'} 
            </button>
          </div>
        </div>
      )}
      {/* Show message if no history log entries */}
      {status === 'succeeded' && totalItems === 0 && (
        <div className="no-data-message">No history log entries found for the selected filters.</div>
      )}
    </div>
  );
};

export default HistoryLog;
