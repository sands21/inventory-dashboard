# Inventory Dashboard

A dashboard application to visualize and manage vehicle inventory data built with React, Redux Toolkit, and Express.

## Features

- View recent inventory data with key metrics
- Interactive inventory count charts filterable by vehicle type (NEW, USED, CPO)
- Average MSRP visualization by vehicle type
- Comprehensive history log with detailed inventory statistics
- Filter functionality by vehicle make and time duration

## Technology Stack

- **Frontend**: React, Redux Toolkit, Chart.js (via react-chartjs-2), Axios
- **Backend**: Express, Node.js
- **Data Processing**: `csv-parser` library

## Project Structure

The project is organized into two main directories:

- `client/`: React frontend application
- `server/`: Express backend API

## Setup & Installation

1. Clone the repository
   ```sh
   git clone <repository-url>
   cd inventory-dashboard
   ```

2. Install dependencies for both client and server
   ```sh
   npm run install:all
   ```

3. Start the development server (runs both frontend and backend)
   ```sh
   npm run dev
   ```

4. The application will be available at:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## API Documentation

### GET /api/inventory

Fetches aggregated inventory data based on optional filters.

**Query Parameters:**
- `make` (optional): Comma-separated string of vehicle makes to include (e.g., "Ford,Cadillac"). Case-insensitive. If omitted, all makes are included.
- `duration` (optional): Filter by time period. If omitted, no time filter is applied. Options:
  - `lastMonth`: Data from the previous calendar month.
  - `thisMonth`: Data from the start of the current calendar month to the current date.
  - `last3Months`: Data from the start of the month 3 months prior to the current month, up to the end of the current month.
  - `last6Months`: Data from the start of the month 6 months prior to the current month, up to the end of the current month.
  - `thisYear`: Data from the start of the current calendar year to the current date.
  - `lastYear`: Data from the previous calendar year.

**Success Response (200 OK):**
Returns a JSON object containing aggregated data structures:
```json
{
  "summary": {
    "totalCount": 150, // Example value
    "totalMsrp": 4500000,
    "newCount": 80,
    "newMsrp": 2800000,
    "newAvgMsrp": 35000,
    "usedCount": 60,
    "usedMsrp": 1500000,
    "usedAvgMsrp": 25000,
    "cpoCount": 10,
    "cpoMsrp": 200000,
    "cpoAvgMsrp": 20000,
    "avgMsrp": 30000 // Overall average MSRP
  },
  "inventoryCountChartData": {
    "labels": ["2024-01", "2024-02", "2024-03"], // Example months
    "datasets": {
      "NEW": [30, 25, 25],
      "USED": [20, 20, 20],
      "CPO": [5, 3, 2]
    }
  },
  "averageMsrpChartData": {
    "labels": ["2024-01", "2024-02", "2024-03"],
    "datasets": {
      "NEW": [35500, 34800, 35100],
      "USED": [25200, 24900, 25000],
      "CPO": [20100, 19800, 20050]
    }
  },
  "historyLog": [ // Daily aggregated data, sorted descending by date
    {
      "date": "2024-03-15",
      "NEW": { "count": 5, "totalMsrp": 175000, "avgMsrp": 35000 },
      "USED": { "count": 3, "totalMsrp": 75000, "avgMsrp": 25000 },
      "CPO": { "count": 1, "totalMsrp": 20000, "avgMsrp": 20000 }
    },
    {
      "date": "2024-03-14",
      // ... more daily entries
    }
  ],
  "filtersApplied": { // Echoes back the filters used for this request
      "make": ["ford", "cadillac"], // Example
      "duration": "last3Months"
   }
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Failed to fetch inventory data",
  "message": "Detailed error message here" // Included for debugging
}
```

## Building for Production

1. Build the React frontend
   ```sh
   npm run build
   ```

2. Start the production server
   ```sh
   npm start
   ```

## Time Spent on Implementation

Total development time: 3 days
