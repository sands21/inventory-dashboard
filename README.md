# Inventory Dashboard

A dashboard application to visualize and manage vehicle inventory data built with React, Redux Toolkit, and Express.

## Features

- View recent inventory data with key metrics
- Interactive inventory count charts filterable by vehicle type (NEW, USED, CPO)
- Average MSRP visualization by vehicle type
- Comprehensive history log with detailed inventory statistics
- Filter functionality by vehicle make and time duration

## Technology Stack

- **Frontend**: React, Redux Toolkit, Chart.js
- **Backend**: Express, Node.js
- **Data Processing**: CSV parsing

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

Fetches inventory data with optional filtering.

**Query Parameters:**
- `make` (optional): Filter by vehicle make (e.g., "Ford,Cadillac")
- `duration` (optional): Filter by time period, options include:
  - `lastMonth`: Data from the previous month
  - `thisMonth`: Data from the current month
  - `last3Months`: Data from the last 3 months
  - `last6Months`: Data from the last 6 months
  - `thisYear`: Data from the current year
  - `lastYear`: Data from the previous year

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "type": "NEW",
    "make": "Ford",
    "model": "F-150",
    "year": "2024",
    "msrp": "52000"
  }
]
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
