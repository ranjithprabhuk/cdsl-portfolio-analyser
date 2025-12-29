# CDSL Portfolio Analyzer

A responsive web application for analyzing CDSL portfolio CSV files with support for multiple family member portfolios.

## Features

- 📁 Multi-file CSV upload support
- 📊 Asset classification (Equities, Bonds, ETFs, SGBs, InvITs)
- 📈 Interactive charts and visualizations
- 👨‍👩‍👧‍👦 Combined family portfolio view
- 🔍 Sortable and searchable holdings table
- 📱 Fully responsive Bootstrap 5 UI

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. Click the "Browse Files" button or drag and drop CDSL CSV files
2. Upload multiple CSV files for different family members
3. View the combined portfolio in the "Combined Portfolio" tab
4. Switch between individual portfolio tabs to see details for each member
5. Use the search and filter options to explore holdings

## CSV Format

The application expects CDSL CSV files with the following structure:
- Header section (lines 1-8) with DP ID, Client ID, Holder Name, Total Portfolio Value
- Column headers on line 10
- Data rows starting from line 11

## Technologies Used

- React 18
- Vite
- Bootstrap 5
- PapaParse (CSV parsing)
- Recharts (Data visualization)
- date-fns (Date handling)
