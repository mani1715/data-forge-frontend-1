import React from 'react';
import { Table } from 'lucide-react';

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card" data-testid="data-table">
        <h3>
          <Table />
          Data Preview
        </h3>
        <div className="no-data">No data to display</div>
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  // Function to check if a value is "missing" and should be highlighted
  const isMissingValue = (value, columnName) => {
    // Check for null, undefined, NaN
    if (value === null || value === undefined) return true;
    
    const strValue = String(value).trim().toLowerCase();
    
    // Check for common missing value indicators
    if (strValue === '' || strValue === 'nan' || strValue === 'none' || strValue === 'null') return true;
    
    // Check for "Unknown" in text columns (not ID/Order columns)
    const colLower = columnName.toLowerCase();
    if (strValue === 'unknown' && !colLower.includes('id') && !colLower.includes('order')) return true;
    
    // Check for zero in numeric columns that typically shouldn't be zero
    // (like ID, Age, Price, Quantity, but NOT columns that can legitimately be 0)
    if (value === 0 || strValue === '0') {
      const zeroSignificantCols = ['id', 'age', 'price', 'salary', 'amount', 'quantity', 'qty', 'order'];
      if (zeroSignificantCols.some(col => colLower.includes(col))) {
        return true;
      }
    }
    
    // Check for placeholder date
    if (strValue === '00-00-0000' || strValue === '0000-00-00') return true;
    
    // Check for "MISSING" text
    if (strValue === 'missing') return true;
    
    return false;
  };

  // Format display value
  const formatDisplayValue = (value, columnName) => {
    if (value === null || value === undefined) return 'MISSING';
    
    const strValue = String(value).trim();
    
    if (strValue === '' || strValue.toLowerCase() === 'nan' || strValue.toLowerCase() === 'none') {
      return 'MISSING';
    }
    
    // Show actual value for zeros (but mark as missing visually)
    if (value === 0 || strValue === '0') {
      const colLower = columnName.toLowerCase();
      const zeroSignificantCols = ['id', 'age', 'price', 'salary', 'amount', 'quantity', 'qty', 'order'];
      if (zeroSignificantCols.some(col => colLower.includes(col))) {
        return '0 (Missing)';
      }
    }
    
    if (strValue === '00-00-0000' || strValue === '0000-00-00') {
      return 'Invalid Date';
    }
    
    return strValue;
  };

  return (
    <div className="card" data-testid="data-table">
      <h3>
        <Table />
        Data Preview (First 20 Rows)
      </h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {headers.map((key) => {
                  const value = row[key];
                  const missing = isMissingValue(value, key);
                  const displayValue = formatDisplayValue(value, key);
                  
                  return (
                    <td key={key}>
                      {missing ? (
                        <span className="missing-val" data-testid="missing-cell">{displayValue}</span>
                      ) : (
                        displayValue
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
