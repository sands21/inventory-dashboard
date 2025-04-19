import React, { useState } from 'react'; 
import { useSelector } from 'react-redux';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { VEHICLE_TYPES, CHART_COLORS } from '../../utils/constants';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InventoryCount = () => {
  // Select pre-aggregated chart data and status from state
  const { inventoryCountChartData, status } = useSelector(state => state.inventory);
  const [activeType, setActiveType] = useState(VEHICLE_TYPES.NEW); 

  const handleTypeChange = (type) => {
    setActiveType(type);
  };

  // Prepare data for ChartJS based on selected type and backend data
  let chartJsData = null;
  if (status === 'succeeded' && inventoryCountChartData && inventoryCountChartData.labels && inventoryCountChartData.datasets) {
    const labels = inventoryCountChartData.labels;
    const dataset = inventoryCountChartData.datasets && inventoryCountChartData.datasets[activeType]
      ? inventoryCountChartData.datasets[activeType]
      : []; 

    chartJsData = {
      labels: labels,
      datasets: [
        {
          label: activeType,
          data: dataset,
          backgroundColor: CHART_COLORS[activeType],
          borderWidth: 0,
          borderRadius: 4,
        }
      ]
    };
  } else if (status === 'succeeded') {
  }

  if (status === 'loading') {
    return <div className="section">Loading inventory count chart...</div>;
  }

  const renderChart = () => {
    if (status === 'succeeded' && chartJsData) {
      return (
        <Chart
          key={activeType} 
          type="bar"
          data={chartJsData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Count: ${context.raw !== undefined ? context.raw : 'N/A'}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f0f0f0'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }}
          height={300} 
        />
      );
    }
    
    if (status === 'succeeded' && !chartJsData) {
       return <div className="chart-container">No data available for the selected criteria.</div>;
    }
    return null; 
  };

  return (
    <div className="section">
      <h3 className="section-title">Inventory Count</h3>

      <div className="tabs">
        
        {Object.values(VEHICLE_TYPES).map((type) => (
          <div
            key={type}
            className={`tab ${activeType === type ? 'active' : ''}`}
            onClick={() => handleTypeChange(type)}
          >
            {type}
          </div>
        ))}
      </div>

      <div className="chart-container">
        {renderChart()}
      </div>
    </div>
  );
}; 

export default InventoryCount;
