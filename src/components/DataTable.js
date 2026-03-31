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

  // Function to check if a value should be shown in RED (missing/placeholder value)
  const isMissingValue = (value, columnName) => {
    if (value === null || value === undefined) return true;
    
    const strValue = String(value).trim().toLowerCase();
    const colLower = columnName.toLowerCase();
    
    // Check for common missing value indicators
    if (strValue === '' || strValue === 'nan' || strValue === 'none' || strValue === 'null') return true;
    
    // Check for "Unknown" - always red
    if (strValue === 'unknown') return true;
    
    // Check for 0 in numeric columns (price, amount, quantity, age, salary, id, etc.)
    if ((value === 0 || strValue === '0' || strValue === '0.0') && 
        (colLower.includes('price') || colLower.includes('amount') || 
         colLower.includes('cost') || colLower.includes('total') ||
         colLower.includes('quantity') || colLower.includes('qty') ||
         colLower.includes('age') || colLower.includes('salary') ||
         colLower.includes('revenue') || colLower.includes('id') ||
         colLower.includes('number') || colLower.includes('count'))) {
      return true;
    }
    
    // Check for placeholder date
    if (strValue === '00-00-0000' || strValue === '0000-00-00' || 
        strValue === '00/00/0000' || strValue === '0000/00/00') {
      return true;
    }
    
    return false;
  };

  // Format display value
  const formatDisplayValue = (value, columnName) => {
    if (value === null || value === undefined) return 'MISSING';
    
    const strValue = String(value).trim();
    
    if (strValue === '' || strValue.toLowerCase() === 'nan' || strValue.toLowerCase() === 'none') {
      return 'MISSING';
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
