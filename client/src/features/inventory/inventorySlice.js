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
  summary: { 
    totalCount: 0,
    totalMsrp: 0,
    newCount: 0, newMsrp: 0, newAvgMsrp: 0,
    usedCount: 0, usedMsrp: 0, usedAvgMsrp: 0,
    cpoCount: 0, cpoMsrp: 0, cpoAvgMsrp: 0,
    avgMsrp: 0,
  },
  inventoryCountChartData: { labels: [], datasets: { NEW: [], USED: [], CPO: [] } }, 
  averageMsrpChartData: { labels: [], datasets: { NEW: [], USED: [], CPO: [] } }, 
  historyLog: [], 
  filtersApplied: { make: [], duration: null }, 
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
        // Directly assign the aggregated data from the backend payload
        state.summary = action.payload.summary || initialState.summary;
        state.inventoryCountChartData = action.payload.inventoryCountChartData || initialState.inventoryCountChartData;
        state.averageMsrpChartData = action.payload.averageMsrpChartData || initialState.averageMsrpChartData;
        state.historyLog = action.payload.historyLog || initialState.historyLog;
        state.filtersApplied = action.payload.filtersApplied || initialState.filtersApplied;
        state.error = null; // Clear previous errors on success
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default inventorySlice.reducer;
