import React, { useState, useMemo } from 'react';
import { formatCurrency, formatNumber, truncateText } from '../utils/formatters';
import { getAssetBadgeClass, getAssetTypes } from '../utils/assetClassifier';
import { sortHoldings, filterHoldingsByAssetType, searchHoldings } from '../utils/portfolioAggregator';

function HoldingsTable({ holdings, showHolderInfo = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState('All');
  const [sortField, setSortField] = useState('value');
  const [sortDirection, setSortDirection] = useState('desc');

  const assetTypes = useMemo(() => {
    return ['All', ...getAssetTypes(holdings)];
  }, [holdings]);

  const filteredAndSortedHoldings = useMemo(() => {
    let result = [...holdings];
    
    // Apply search filter
    result = searchHoldings(result, searchTerm);
    
    // Apply asset type filter
    result = filterHoldingsByAssetType(result, selectedAssetType);
    
    // Apply sorting
    result = sortHoldings(result, sortField, sortDirection);
    
    return result;
  }, [holdings, searchTerm, selectedAssetType, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return '⇅';
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (!holdings || holdings.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <p className="text-muted">No holdings data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Holdings Breakdown</h5>
        
        {/* Search and Filter Controls */}
        <div className="row mb-3 g-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search by ISIN or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedAssetType}
              onChange={(e) => setSelectedAssetType(e.target.value)}
            >
              {assetTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-2 text-muted small">
          Showing {filteredAndSortedHoldings.length} of {holdings.length} holdings
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover table-sm holdings-table">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('srNo')}>
                  # {getSortIcon('srNo')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('isin')}>
                  ISIN {getSortIcon('isin')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('isinName')}>
                  Name {getSortIcon('isinName')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('assetType')}>
                  Type {getSortIcon('assetType')}
                </th>
                <th className="text-end" style={{ cursor: 'pointer' }} onClick={() => handleSort('balance')}>
                  Quantity {getSortIcon('balance')}
                </th>
                <th className="text-end" style={{ cursor: 'pointer' }} onClick={() => handleSort('lastClosingPrice')}>
                  Price {getSortIcon('lastClosingPrice')}
                </th>
                <th className="text-end" style={{ cursor: 'pointer' }} onClick={() => handleSort('value')}>
                  Value {getSortIcon('value')}
                </th>
                {showHolderInfo && (
                  <th>Holder</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedHoldings.map((holding, index) => (
                <tr key={`${holding.isin}-${index}`}>
                  <td>{holding.srNo || index + 1}</td>
                  <td>
                    <small className="font-monospace">{holding.isin}</small>
                  </td>
                  <td>
                    <span title={holding.isinName}>
                      {truncateText(holding.isinName, 60)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getAssetBadgeClass(holding.assetType)}`}>
                      {holding.assetType}
                    </span>
                  </td>
                  <td className="text-end">{formatNumber(holding.balance || holding.totalBalance)}</td>
                  <td className="text-end">{formatCurrency(holding.lastClosingPrice)}</td>
                  <td className="text-end fw-semibold">
                    {formatCurrency(holding.value || holding.totalValue)}
                  </td>
                  {showHolderInfo && (
                    <td>
                      <small>{holding.holderName || '-'}</small>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedHoldings.length === 0 && (
          <div className="text-center py-4 text-muted">
            No holdings found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
}

export default HoldingsTable;
