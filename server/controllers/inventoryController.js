const fs = require('fs');
const path = require('path');
const csvParser = require('../utils/csvParser');

const dataFilePath = path.join(__dirname, '../data/sample-data-v2.csv');

// Helper function to safely parse price, ensuring it returns a number (0 if invalid)
const getPrice = (item) => {
  // Ensure item.price exists and is treated as a string before cleaning
  const priceStr = String(item.price || '');
  // Remove non-numeric characters except decimal point and potential negative sign
  const cleanedPriceStr = priceStr.replace(/[^0-9.-]+/g,"");
  const priceNum = parseFloat(cleanedPriceStr);
  // Return 0 if parsing results in NaN or if the cleaned string was empty
  return isNaN(priceNum) ? 0 : priceNum;
};

// Helper function to get condition category
const getConditionCategory = (item) => {
  if (!item.condition) return 'OTHER';
  const condition = item.condition.toUpperCase();
  if (condition === 'NEW') return 'NEW';
  if (condition === 'USED') return 'USED';
  if (['CPO', 'CERTIFIED'].includes(condition)) return 'CPO';
  return 'OTHER';
};

// Helper function to format date as YYYY-MM
const formatMonthYear = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) return null;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

// Helper function to format date
const formatDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) return null;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};


// Controller function to get inventory data
exports.getInventory = async (req, res) => {
  try {
    // Parse query parameters for filtering
    const { make, duration } = req.query;
    const makes = make ? make.split(',').map(m => m.trim().toLowerCase()) : [];

    // Parse the CSV file
    let rawData = await csvParser(dataFilePath);

    // Process the data: parse dates, price, and condition
    const processedData = rawData.map(item => ({
      ...item,
      date: item.timestamp ? new Date(item.timestamp) : null,
      price: getPrice(item),
      conditionCategory: getConditionCategory(item)
    })).filter(item => item.date && !isNaN(item.date)); 

    // Apply filters
    let filteredData = processedData.filter(item => {
      const makeMatch = makes.length === 0 || (item.brand && makes.includes(item.brand.trim().toLowerCase()));

      // Duration filter
      let dateMatch = true;
      if (duration) {
        const now = new Date();
        let startDate;
        let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        switch(duration) {
          case 'lastMonth':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999); 
            break;
          case 'thisMonth':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = now; 
            break;
          case 'last3Months':
            
            startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
            
            break;
          case 'last6Months':
             
            startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
             
            break;
          case 'thisYear':
            startDate = new Date(now.getFullYear(), 0, 1);
             
            break;
          case 'lastYear':
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999); 
            break;
          default:
             startDate = null; 
             break;
        }

        if (startDate) {
           
           dateMatch = item.date && item.date >= startDate && item.date <= endDate;
        }
      }

      return makeMatch && dateMatch;
    });

    // 1. Summary Statistics
    let summary = {
      totalCount: filteredData.length,
      totalMsrp: 0,
      newCount: 0, newMsrp: 0,
      usedCount: 0, usedMsrp: 0,
      cpoCount: 0, cpoMsrp: 0,
    };

    // 2. Chart Data Aggregation (Monthly)
    const monthlyData = {}; // Key: YYYY-MM

    // 3. History Log Aggregation (Daily)
    const dailyData = {}; // Key: YYYY-MM-DD

    filteredData.forEach(item => {
      const price = item.price; 
      if (typeof price !== 'number' || isNaN(price)) {
         return; 
      }

      summary.totalMsrp += price;

      const category = item.conditionCategory;
      if (category === 'NEW') {
        summary.newCount++;
        summary.newMsrp += price;
      } else if (category === 'USED') {
        summary.usedCount++;
        summary.usedMsrp += price;
      } else if (category === 'CPO') {
        summary.cpoCount++;
        summary.cpoMsrp += price;
      }

      // Monthly aggregation for charts
      const monthYear = formatMonthYear(item.date);
      if (monthYear) {
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            month: monthYear,
            NEW: { count: 0, totalMsrp: 0 },
            USED: { count: 0, totalMsrp: 0 },
            CPO: { count: 0, totalMsrp: 0 },
          };
        }
        if (monthlyData[monthYear][category]) {
          monthlyData[monthYear][category].count++;
          monthlyData[monthYear][category].totalMsrp += price;
        }
      }

      // Daily aggregation for history log
      const dateStr = formatDate(item.date);
       if (dateStr) {
         if (!dailyData[dateStr]) {
           dailyData[dateStr] = {
             date: dateStr,
             NEW: { count: 0, totalMsrp: 0 },
             USED: { count: 0, totalMsrp: 0 },
             CPO: { count: 0, totalMsrp: 0 },
           };
         }
         if (dailyData[dateStr][category]) {
           dailyData[dateStr][category].count++;
           dailyData[dateStr][category].totalMsrp += price;
         }
       }
    });

    // Calculate Averages for Summary
    summary.avgMsrp = summary.totalCount > 0 ? summary.totalMsrp / summary.totalCount : 0;
    summary.newAvgMsrp = summary.newCount > 0 ? summary.newMsrp / summary.newCount : 0;
    summary.usedAvgMsrp = summary.usedCount > 0 ? summary.usedMsrp / summary.usedCount : 0;
    summary.cpoAvgMsrp = summary.cpoCount > 0 ? summary.cpoMsrp / summary.cpoCount : 0;

    // Process Monthly Data for Charts
    const chartMonths = Object.keys(monthlyData).sort();
    const inventoryCountChartData = {
      labels: chartMonths,
      datasets: {
        NEW: chartMonths.map(month => monthlyData[month].NEW.count),
        USED: chartMonths.map(month => monthlyData[month].USED.count),
        CPO: chartMonths.map(month => monthlyData[month].CPO.count),
      }
    };
    const averageMsrpChartData = {
      labels: chartMonths,
      datasets: {
        NEW: chartMonths.map(month => {
          const data = monthlyData[month].NEW;
          return data.count > 0 ? data.totalMsrp / data.count : 0;
        }),
        USED: chartMonths.map(month => {
          const data = monthlyData[month].USED;
          return data.count > 0 ? data.totalMsrp / data.count : 0;
        }),
        CPO: chartMonths.map(month => {
          const data = monthlyData[month].CPO;
          return data.count > 0 ? data.totalMsrp / data.count : 0;
        }),
      }
    };
    

    // Process Daily Data for History Log
    const historyLog = Object.values(dailyData)
      .sort((a, b) => new Date(b.date) - new Date(a.date)) 
      .map(entry => ({
        date: entry.date,
        NEW: {
          count: entry.NEW.count || 0,
          totalMsrp: isNaN(entry.NEW.totalMsrp) ? 0 : entry.NEW.totalMsrp,
          avgMsrp: entry.NEW.count > 0 && typeof entry.NEW.totalMsrp === 'number' && !isNaN(entry.NEW.totalMsrp)
                   ? entry.NEW.totalMsrp / entry.NEW.count
                   : 0,
        },
        USED: {
          count: entry.USED.count || 0,
          totalMsrp: typeof entry.USED.totalMsrp === 'number' && !isNaN(entry.USED.totalMsrp) ? entry.USED.totalMsrp : 0,
          avgMsrp: entry.USED.count > 0 && typeof entry.USED.totalMsrp === 'number' && !isNaN(entry.USED.totalMsrp)
                   ? entry.USED.totalMsrp / entry.USED.count
                   : 0,
        },
        CPO: {
          count: entry.CPO.count || 0,
          totalMsrp: typeof entry.CPO.totalMsrp === 'number' && !isNaN(entry.CPO.totalMsrp) ? entry.CPO.totalMsrp : 0,
          avgMsrp: entry.CPO.count > 0 && typeof entry.CPO.totalMsrp === 'number' && !isNaN(entry.CPO.totalMsrp)
                   ? entry.CPO.totalMsrp / entry.CPO.count
                   : 0,
        },
      }));

    // Construct final response
    const responsePayload = {
      summary,
      inventoryCountChartData,
      averageMsrpChartData,
      historyLog,
      filtersApplied: { make: makes, duration } 
    };

    res.json(responsePayload);

  } catch (error) {
    console.error('Error fetching inventory data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory data',
      message: error.message 
    });
  }
};
