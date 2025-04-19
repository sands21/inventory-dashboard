import React, { useState, useEffect } from 'react';
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
import { formatCurrency } from '../../utils/formatters';
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

const AverageMSRP = () => {
  // Select pre-aggregated chart data and status from state
  const { averageMsrpChartData, status } = useSelector(state => state.inventory);
  const [activeType, setActiveType] = useState(VEHICLE_TYPES.NEW); // Keep local state for active tab

  const handleTypeChange = (type) => {
    setActiveType(type);
  };

  // Prepare data for ChartJS based on selected type and backend data
  let chartJsData = null;
  if (status === 'succeeded' && averageMsrpChartData && averageMsrpChartData.labels && averageMsrpChartData.datasets) {
    const labels = averageMsrpChartData.labels;
    const dataset = averageMsrpChartData.datasets && averageMsrpChartData.datasets[activeType]
      ? averageMsrpChartData.datasets[activeType]
      : []; 

    chartJsData = {
      labels: labels,
      datasets: [
        {
          label: `Average MSRP (${activeType})`,
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
    return <div className="section">Loading average MSRP chart...</div>;
  }
  
  return (
    <div className="section">
      <h3 className="section-title">Average MSRP in USD</h3>
      
      <div className="tabs">
        <div 
          className={`tab ${activeType === VEHICLE_TYPES.NEW ? 'active' : ''}`}
          onClick={() => handleTypeChange(VEHICLE_TYPES.NEW)}
        >
          NEW
        </div>
        <div 
          className={`tab ${activeType === VEHICLE_TYPES.USED ? 'active' : ''}`}
          onClick={() => handleTypeChange(VEHICLE_TYPES.USED)}
        >
          USED
        </div>
        <div 
          className={`tab ${activeType === VEHICLE_TYPES.CPO ? 'active' : ''}`}
          onClick={() => handleTypeChange(VEHICLE_TYPES.CPO)}
        >
          CPO
        </div>
      </div>
      
      <div className="chart-container">
        {status === 'succeeded' && chartJsData ? (
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
                      return `Avg MSRP: ${formatCurrency(context.raw !== undefined ? context.raw : 0)}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: '#f0f0f0' 
                  },
                  ticks: {
                    callback: function(value) {
                      return formatCurrency(value, 0); 
                    }
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
        ) : (
           status === 'succeeded' && <div className="chart-container">No data available for the selected criteria.</div>
        )}
      </div>
    </div>
  );
};

export default AverageMSRP;
