import Papa from 'papaparse';

/**
 * Parse CDSL CSV file and extract portfolio data
 * @param {string} fileContent - Raw CSV file content
 * @returns {Object} Parsed portfolio data with metadata and holdings
 */
export function parseCDSLFile(fileContent) {
  try {
    const lines = fileContent.split('\n');
    
    // Extract metadata from header (lines 1-8)
    const metadata = extractMetadata(lines);
    
    // Find the data section (starts after blank line, typically line 10)
    let dataStartIndex = 9; // Line 10 (0-indexed as 9)
    
    // Parse CSV data starting from line 10
    const csvData = lines.slice(dataStartIndex).join('\n');
    
    const parseResult = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings to handle quoted numbers
      transformHeader: (header) => header.trim(),
    });
    
    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing warnings:', parseResult.errors);
    }
    
    // Transform holdings data
    const holdings = parseResult.data.map((row, index) => ({
      srNo: parseInt(row['Sr.No.']) || index + 1,
      isin: row['ISIN']?.trim() || '',
      isinName: row['ISIN Name']?.trim() || '',
      isinListing: row['ISIN Listing']?.trim() || '',
      paidUpValue: parseFloat(row['Paid Up Value']) || 0,
      balance: parseFloat(row['Balance']) || 0,
      lastClosingPrice: parseFloat(row['Last Closing Price']) || 0,
      value: parseFloat(row['Value']) || 0,
    })).filter(holding => holding.isin); // Filter out invalid rows
    
    return {
      metadata,
      holdings,
      rawData: parseResult.data,
    };
  } catch (error) {
    console.error('Error parsing CDSL file:', error);
    throw new Error(`Failed to parse CSV file: ${error.message}`);
  }
}

/**
 * Extract metadata from header lines
 * @param {Array<string>} lines - Array of file lines
 * @returns {Object} Metadata object
 */
function extractMetadata(lines) {
  const metadata = {
    dpId: '',
    clientId: '',
    holderName: '',
    dpName: '',
    category: '',
    accountStatus: '',
    statementDate: '',
    totalPortfolioValue: 0,
  };
  
  // Extract each field using regex patterns
  lines.slice(0, 8).forEach(line => {
    if (line.includes('DP ID')) {
      const match = line.match(/DP ID\s*:\s*(\d+)/);
      if (match) metadata.dpId = match[1];
    } else if (line.includes('Client ID')) {
      const match = line.match(/Client ID\s*:\s*(\d+)/);
      if (match) metadata.clientId = match[1];
    } else if (line.includes('First/Sole Holder')) {
      const match = line.match(/First\/Sole Holder\s*:\s*(.+)/);
      if (match) metadata.holderName = match[1].trim();
    } else if (line.includes('DP Name')) {
      const match = line.match(/DP Name\s*:\s*(.+)/);
      if (match) metadata.dpName = match[1].trim();
    } else if (line.includes('Category')) {
      const match = line.match(/Category\s*:\s*(.+)/);
      if (match) metadata.category = match[1].trim();
    } else if (line.includes('Account Status')) {
      const match = line.match(/Account Status\s*:\s*(.+)/);
      if (match) metadata.accountStatus = match[1].trim();
    } else if (line.includes('Statement as on')) {
      const match = line.match(/Statement as on\s*:\s*(.+)/);
      if (match) metadata.statementDate = match[1].trim();
    } else if (line.includes('Total Portfolio Value')) {
      const match = line.match(/Total Portfolio Value\s*=\s*([\d.]+)/);
      if (match) metadata.totalPortfolioValue = parseFloat(match[1]);
    }
  });
  
  return metadata;
}

/**
 * Parse multiple CSV files
 * @param {Array<File>} files - Array of File objects
 * @returns {Promise<Array>} Array of parsed portfolio objects
 */
export async function parseMultipleFiles(files) {
  const promises = Array.from(files).map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const parsed = parseCDSLFile(content);
          resolve({
            fileName: file.name,
            ...parsed,
          });
        } catch (error) {
          reject({
            fileName: file.name,
            error: error.message,
          });
        }
      };
      
      reader.onerror = () => {
        reject({
          fileName: file.name,
          error: 'Failed to read file',
        });
      };
      
      reader.readAsText(file);
    });
  });
  
  return Promise.allSettled(promises);
}

/**
 * Validate if file is a valid CSV
 * @param {File} file - File object
 * @returns {boolean} True if valid CSV
 */
export function isValidCSVFile(file) {
  const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
  const validExtensions = ['.csv'];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  
  return hasValidType || hasValidExtension;
}
