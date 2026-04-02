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

  // Check if a value should be shown in RED (missing/placeholder)
  const isMissingValue = (value, columnName) => {
    if (value === null || value === undefined) return true;
    
    const strValue = String(value).trim().toLowerCase();
    const colLower = columnName.toLowerCase();
    
    // Common missing indicators
    if (strValue === '' || strValue === 'nan' || strValue === 'none' || 
        strValue === 'null' || strValue === 'missing' || strValue === '??' || 
        strValue === '?' || strValue === 'unknown') {
      return true;
    }
    
    // Order ID: 0 or just "0" is missing
    if ((colLower.includes('order') || colLower === 'id') && 
        (strValue === '0' || strValue === '0.0' || value === 0)) {
      return true;
    }
    
    // Date: 00-00-0000 is missing
    if ((colLower.includes('date') || colLower.includes('dob')) &&
        (strValue === '00-00-0000' || strValue === '0000-00-00' || strValue === '00/00/0000')) {
      return true;
    }
    
    // Price/Quantity: 0 might be missing (only if column suggests it shouldn't be 0)
    if ((colLower.includes('price') || colLower.includes('amount') || 
         colLower.includes('quantity') || colLower.includes('qty')) &&
        (value === 0 || strValue === '0' || strValue === '0.0')) {
      return true;
    }
    
    return false;
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
                  const displayValue = value === null || value === undefined ? 'MISSING' : String(value);
                  
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
