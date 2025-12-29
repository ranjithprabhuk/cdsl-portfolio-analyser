/**
 * Classify asset type based on ISIN and ISIN Name
 * @param {string} isin - ISIN code
 * @param {string} isinName - ISIN Name/Description
 * @returns {string} Asset type (Equity, Bond/NCD, ETF, SGB, InvIT, Other)
 */
export function classifyAsset(isin, isinName) {
  if (!isin || !isinName) return 'Other';
  
  const isinUpper = isin.toUpperCase();
  const nameUpper = isinName.toUpperCase();
  
  // Sovereign Gold Bonds (SGB)
  if (nameUpper.startsWith('GOVT OF INDIA#2.5%') && nameUpper.includes('SGB')) {
    return 'SGB';
  }
  
  // Infrastructure Investment Trusts (InvIT)
  if (nameUpper.includes('INVIT FUND') || nameUpper.includes('INVESTMENT TRUST')) {
    return 'InvIT';
  }
  
  // Exchange Traded Funds (ETF)
  if (isinUpper.startsWith('INF') && 
      (nameUpper.includes('ETF') || 
       nameUpper.includes('EXCHANGE TRADED FUND') ||
       nameUpper.includes('MUTUAL FUND') ||
       nameUpper.includes('MF-'))) {
    return 'ETF';
  }
  
  // Bonds/NCDs (Non-Convertible Debentures)
  if ((nameUpper.includes('NCD') || 
       nameUpper.includes('SEC GRT') || 
       nameUpper.includes('USEC') ||
       nameUpper.includes('TAX NCUM') ||
       nameUpper.includes('RTD RED') ||
       nameUpper.includes('PRN PRT') ||
       /\d+\.\d+%/.test(nameUpper))) {
    return 'Bond/NCD';
  }
  
  // Equities
  if ((isinUpper.startsWith('INE') && isinUpper.match(/INE.*01\d{3}/)) &&
      (nameUpper.includes('EQUITY') || 
       nameUpper.includes('EQ SH') || 
       nameUpper.includes('EQTY SHARES') ||
       nameUpper.includes('SHARES OF'))) {
    return 'Equity';
  }
  
  // Fallback: Check for common equity keywords
  if (nameUpper.includes('LIMITED') && 
      (nameUpper.includes('SHARES') || nameUpper.includes('EQUITY')) &&
      !nameUpper.includes('NCD') &&
      !nameUpper.includes('BOND')) {
    return 'Equity';
  }
  
  return 'Other';
}

/**
 * Get color for asset type (for charts and badges)
 * @param {string} assetType - Asset type
 * @returns {string} Color hex code
 */
export function getAssetColor(assetType) {
  const colors = {
    'Equity': '#0d6efd',
    'Bond/NCD': '#6610f2',
    'ETF': '#d63384',
    'SGB': '#fd7e14',
    'InvIT': '#20c997',
    'Other': '#6c757d',
  };
  return colors[assetType] || colors['Other'];
}

/**
 * Get badge class for asset type
 * @param {string} assetType - Asset type
 * @returns {string} Bootstrap badge class
 */
export function getAssetBadgeClass(assetType) {
  const classes = {
    'Equity': 'badge-equity',
    'Bond/NCD': 'badge-bond',
    'ETF': 'badge-etf',
    'SGB': 'badge-sgb',
    'InvIT': 'badge-invit',
    'Other': 'badge-other',
  };
  return classes[assetType] || classes['Other'];
}

/**
 * Get display name for asset type
 * @param {string} assetType - Asset type
 * @returns {string} Display name
 */
export function getAssetDisplayName(assetType) {
  const displayNames = {
    'ETF': 'ETF & MF',
    'Equity': 'Equity',
    'Bond/NCD': 'Bond/NCD',
    'SGB': 'SGB',
    'InvIT': 'InvIT',
    'Other': 'Other',
  };
  return displayNames[assetType] || assetType;
}

/**
 * Get all unique asset types from holdings
 * @param {Array} holdings - Array of holdings
 * @returns {Array<string>} Array of unique asset types
 */
export function getAssetTypes(holdings) {
  const types = new Set();
  holdings.forEach(holding => {
    const assetType = classifyAsset(holding.isin, holding.isinName);
    types.add(assetType);
  });
  return Array.from(types).sort();
}

/**
 * Classify and enrich holdings with asset type
 * @param {Array} holdings - Array of holdings
 * @returns {Array} Holdings with assetType field added
 */
export function enrichHoldingsWithAssetType(holdings) {
  return holdings.map(holding => ({
    ...holding,
    assetType: classifyAsset(holding.isin, holding.isinName),
  }));
}
