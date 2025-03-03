import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInventoryData } from '../../services/api';

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await getInventoryData(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: [],
  recentData: {},
  totalCounts: {
    NEW: 0,
    USED: 0,
    CPO: 0,
    total: 0
  },
  averagePrices: {
    NEW: 0,
    USED: 0,
    CPO: 0
  },
  historyLog: [],
  status: 'idle',
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        
        // Calculate recent data metrics
        const sortedData = [...action.payload].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        // Most recent date from data
        const mostRecentDate = sortedData.length > 0 ? sortedData[0].date : '';
        
        // Filter data by condition instead of type
        const newVehicles = action.payload.filter(item => 
          item.condition && item.condition.toUpperCase() === 'NEW'
        );
        const usedVehicles = action.payload.filter(item => 
          item.condition && item.condition.toUpperCase() === 'USED'
        );
        const cpoVehicles = action.payload.filter(item => 
          item.condition && ['CPO', 'CERTIFIED'].includes(item.condition.toUpperCase())
        );
        
        // Calculate total counts
        state.totalCounts = {
          NEW: newVehicles.length,
          USED: usedVehicles.length,
          CPO: cpoVehicles.length,
          total: action.payload.length
        };
        
        // Helper to get price safely
        const getPrice = (item) => {
          return parseFloat(item.price || 0);
        };
        
        // Calculate average prices for each condition
        state.averagePrices = {
          NEW: newVehicles.length > 0 
            ? newVehicles.reduce((sum, item) => sum + getPrice(item), 0) / newVehicles.length 
            : 0,
          USED: usedVehicles.length > 0 
            ? usedVehicles.reduce((sum, item) => sum + getPrice(item), 0) / usedVehicles.length 
            : 0,
          CPO: cpoVehicles.length > 0 
            ? cpoVehicles.reduce((sum, item) => sum + getPrice(item), 0) / cpoVehicles.length 
            : 0
        };
        
        // Generate history log entries by date
        const dateMap = {};
        
        action.payload.forEach(item => {
          if (!item.date) {
            console.warn("Item missing date:", item);
            return;
          }
          
          const date = typeof item.date === 'string' ? item.date.substring(0, 10) : '';
          if (!date) {
            console.warn("Invalid date format:", item.date);
            return;
          }
          
          if (!dateMap[date]) {
            dateMap[date] = {
              date,
              NEW: { count: 0, totalPrice: 0 },
              USED: { count: 0, totalPrice: 0 },
              CPO: { count: 0, totalPrice: 0 }
            };
          }
          
          // Determine category based on condition
          let category = 'OTHER';
          
          if (item.condition) {
            const condition = item.condition.toUpperCase();
            if (condition === 'NEW') {
              category = 'NEW';
            } else if (condition === 'USED') {
              category = 'USED';
            } else if (['CPO', 'CERTIFIED'].includes(condition)) {
              category = 'CPO';
            }
          }
          
          if (["NEW", "USED", "CPO"].includes(category)) {
            dateMap[date][category].count += 1;
            dateMap[date][category].totalPrice += getPrice(item);
          }
        });
        
        // Convert to array and sort by date
        state.historyLog = Object.values(dateMap)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(entry => ({
            ...entry,
            NEW: {
              ...entry.NEW,
              avgPrice: entry.NEW.count > 0 ? entry.NEW.totalPrice / entry.NEW.count : 0
            },
            USED: {
              ...entry.USED,
              avgPrice: entry.USED.count > 0 ? entry.USED.totalPrice / entry.USED.count : 0
            },
            CPO: {
              ...entry.CPO,
              avgPrice: entry.CPO.count > 0 ? entry.CPO.totalPrice / entry.CPO.count : 0
            }
          }));
          
        // Recent gathered data
        state.recentData = {
          date: mostRecentDate,
          totalItems: state.totalCounts.total,
          newTotal: newVehicles.reduce((sum, item) => sum + getPrice(item), 0),
          usedTotal: usedVehicles.reduce((sum, item) => sum + getPrice(item), 0),
          cpoTotal: cpoVehicles.reduce((sum, item) => sum + getPrice(item), 0),
          newItems: state.totalCounts.NEW,
          usedItems: state.totalCounts.USED,
          cpoItems: state.totalCounts.CPO
        };
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default inventorySlice.reducer;