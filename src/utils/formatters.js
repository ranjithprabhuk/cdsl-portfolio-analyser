/**
 * Format number as Indian currency (INR)
 * @param {number} value - Numeric value
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '₹0.00';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number with Indian number system (lakhs, crores)
 * @param {number} value - Numeric value
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage
 * @param {number} value - Percentage value (0-100)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  
  return `${value.toFixed(2)}%`;
}

/**
 * Format date string
 * @param {string} dateStr - Date string
 * @returns {string} Formatted date
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  
  try {
    // Handle DD-MMM-YYYY format (e.g., "26-Dec-2025")
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const monthMap = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
      const day = parts[0].padStart(2, '0');
      const month = monthMap[parts[1]] || '01';
      const year = parts[2];
      
      const date = new Date(`${year}-${month}-${day}`);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    
    return dateStr;
  } catch (error) {
    return dateStr;
  }
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Format large numbers in compact form (K, L, Cr)
 * @param {number} value - Numeric value
 * @returns {string} Compact formatted string
 */
export function formatCompact(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '₹0';
  }
  
  const absValue = Math.abs(value);
  
  if (absValue >= 10000000) {
    // Crores
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  } else if (absValue >= 100000) {
    // Lakhs
    return `₹${(value / 100000).toFixed(2)}L`;
  } else if (absValue >= 1000) {
    // Thousands
    return `₹${(value / 1000).toFixed(2)}K`;
  }
  
  return formatCurrency(value);
}
