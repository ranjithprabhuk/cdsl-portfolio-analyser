import { enrichHoldingsWithAssetType } from './assetClassifier';

/**
 * Aggregate multiple portfolios into a combined view
 * @param {Array} portfolios - Array of parsed portfolio objects
 * @returns {Object} Aggregated portfolio data
 */
export function aggregatePortfolios(portfolios) {
  if (!portfolios || portfolios.length === 0) {
    return {
      totalValue: 0,
      totalHoldings: 0,
      assetAllocation: [],
      consolidatedHoldings: [],
      portfolioCount: 0,
    };
  }
  
  // Calculate total portfolio value across all portfolios
  const totalValue = portfolios.reduce((sum, portfolio) => {
    return sum + (portfolio.metadata?.totalPortfolioValue || 0);
  }, 0);
  
  // Consolidate all holdings
  const allHoldings = [];
  portfolios.forEach(portfolio => {
    const enrichedHoldings = enrichHoldingsWithAssetType(portfolio.holdings);
    enrichedHoldings.forEach(holding => {
      allHoldings.push({
        ...holding,
        holderName: portfolio.metadata?.holderName || 'Unknown',
        dpId: portfolio.metadata?.dpId || '',
        clientId: portfolio.metadata?.clientId || '',
      });
    });
  });
  
  // Calculate asset allocation
  const assetAllocation = calculateAssetAllocation(allHoldings);
  
  // Consolidate holdings by ISIN (sum quantities across family members)
  const consolidatedHoldings = consolidateHoldingsByISIN(allHoldings);
  
  return {
    totalValue,
    totalHoldings: consolidatedHoldings.length,
    assetAllocation,
    consolidatedHoldings,
    allHoldings, // Keep individual holdings for detailed view
    portfolioCount: portfolios.length,
  };
}

/**
 * Calculate asset-wise allocation
 * @param {Array} holdings - Array of holdings with assetType
 * @returns {Array} Asset allocation summary
 */
export function calculateAssetAllocation(holdings) {
  const assetMap = {};
  
  holdings.forEach(holding => {
    const assetType = holding.assetType || 'Other';
    if (!assetMap[assetType]) {
      assetMap[assetType] = {
        assetType,
        totalValue: 0,
        count: 0,
        totalQuantity: 0,
      };
    }
    assetMap[assetType].totalValue += holding.value;
    assetMap[assetType].count += 1;
    assetMap[assetType].totalQuantity += holding.balance || 0;
  });
  
  // Calculate total value
  const totalValue = Object.values(assetMap).reduce((sum, asset) => sum + asset.totalValue, 0);
  
  // Calculate percentages
  const allocation = Object.values(assetMap).map(asset => ({
    ...asset,
    percentage: totalValue > 0 ? (asset.totalValue / totalValue) * 100 : 0,
  }));
  
  // Sort by total value descending
  allocation.sort((a, b) => b.totalValue - a.totalValue);
  
  return allocation;
}

/**
 * Consolidate holdings by ISIN (aggregate across multiple holders)
 * @param {Array} holdings - Array of all holdings
 * @returns {Array} Consolidated holdings
 */
function consolidateHoldingsByISIN(holdings) {
  const isinMap = {};
  
  holdings.forEach(holding => {
    if (!isinMap[holding.isin]) {
      isinMap[holding.isin] = {
        isin: holding.isin,
        isinName: holding.isinName,
        isinListing: holding.isinListing,
        assetType: holding.assetType,
        lastClosingPrice: holding.lastClosingPrice,
        totalBalance: 0,
        totalValue: 0,
        holders: [],
      };
    }
    
    isinMap[holding.isin].totalBalance += holding.balance;
    isinMap[holding.isin].totalValue += holding.value;
    isinMap[holding.isin].holders.push({
      holderName: holding.holderName,
      balance: holding.balance,
      value: holding.value,
    });
  });
  
  return Object.values(isinMap).sort((a, b) => b.totalValue - a.totalValue);
}

/**
 * Process individual portfolio data
 * @param {Object} portfolio - Single portfolio object
 * @returns {Object} Processed portfolio with asset allocation
 */
export function processIndividualPortfolio(portfolio) {
  if (!portfolio || !portfolio.holdings) {
    return null;
  }
  
  const enrichedHoldings = enrichHoldingsWithAssetType(portfolio.holdings);
  const assetAllocation = calculateAssetAllocation(enrichedHoldings);
  
  return {
    metadata: portfolio.metadata,
    holdings: enrichedHoldings,
    assetAllocation,
    totalHoldings: enrichedHoldings.length,
    totalValue: portfolio.metadata?.totalPortfolioValue || 
                enrichedHoldings.reduce((sum, h) => sum + h.value, 0),
  };
}

/**
 * Get summary statistics for portfolio
 * @param {Array} holdings - Array of holdings
 * @returns {Object} Summary statistics
 */
export function getPortfolioSummary(holdings) {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalQuantity = holdings.reduce((sum, h) => sum + h.balance, 0);
  
  return {
    totalHoldings: holdings.length,
    totalValue,
    totalQuantity,
    avgHoldingValue: holdings.length > 0 ? totalValue / holdings.length : 0,
  };
}

/**
 * Filter holdings by asset type
 * @param {Array} holdings - Array of holdings
 * @param {string} assetType - Asset type to filter
 * @returns {Array} Filtered holdings
 */
export function filterHoldingsByAssetType(holdings, assetType) {
  if (!assetType || assetType === 'All') {
    return holdings;
  }
  return holdings.filter(h => h.assetType === assetType);
}

/**
 * Search holdings by ISIN or name
 * @param {Array} holdings - Array of holdings
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered holdings
 */
export function searchHoldings(holdings, searchTerm) {
  if (!searchTerm) {
    return holdings;
  }
  
  const term = searchTerm.toLowerCase();
  return holdings.filter(h => 
    h.isin.toLowerCase().includes(term) ||
    h.isinName.toLowerCase().includes(term)
  );
}

/**
 * Sort holdings by field
 * @param {Array} holdings - Array of holdings
 * @param {string} field - Field to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} Sorted holdings
 */
export function sortHoldings(holdings, field, direction = 'asc') {
  const sorted = [...holdings].sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    
    // Handle string comparisons
    if (typeof aVal === 'string') {
      return direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    // Handle numeric comparisons
    return direction === 'asc' ? aVal - bVal : bVal - aVal;
  });
  
  return sorted;
}
