import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Download, ArrowLeft, Activity } from 'lucide-react';

const VisualizationsPage = ({ data, tableData, onBack, onDownloadChart }) => {
  const COLORS = ['#0f172a', '#D90429', '#64748b', '#94a3b8', '#cbd5e1', '#059669', '#d97706'];

  // Prepare line chart data from table data (numeric columns trend)
  const prepareLineChartData = () => {
    if (!tableData || tableData.length === 0) return [];
    
    const numericCols = Object.keys(tableData[0]).filter(key => {
      const val = tableData[0][key];
      return typeof val === 'number' || !isNaN(parseFloat(val));
    }).slice(0, 5); // Max 5 columns for clarity

    return tableData.slice(0, 20).map((row, index) => {
      const point = { index: index + 1 };
      numericCols.forEach(col => {
        const val = parseFloat(row[col]);
        point[col] = isNaN(val) ? 0 : val;
      });
      return point;
    });
  };

  // Prepare column statistics for area chart
  const prepareColumnStats = () => {
    if (!tableData || tableData.length === 0) return [];
    
    const stats = [];
    const columns = Object.keys(tableData[0]);
    
    columns.forEach(col => {
      const values = tableData.map(row => row[col]);
      const missing = values.filter(v => v === null || v === undefined || v === '' || v === 'Unknown' || v === 0 || String(v).toLowerCase() === 'nan').length;
      const filled = values.length - missing;
      
      stats.push({
        name: col.length > 10 ? col.substring(0, 10) + '...' : col,
        fullName: col,
        missing: missing,
        filled: filled,
        total: values.length
      });
    });
    
    return stats.slice(0, 10); // Max 10 columns
  };

  const lineChartData = prepareLineChartData();
  const columnStats = prepareColumnStats();
  const numericColumns = lineChartData.length > 0 ? Object.keys(lineChartData[0]).filter(k => k !== 'index') : [];

  const handleDownloadChartData = (chartType) => {
    let csvContent = '';
    let filename = '';

    if (chartType === 'missing' && data?.missing_data) {
      csvContent = 'Column,Missing Values\n';
      data.missing_data.forEach(item => {
        csvContent += `${item.name},${item.missing}\n`;
      });
      filename = 'missing_values_data.csv';
    } else if (chartType === 'types' && data?.type_data) {
      csvContent = 'Data Type,Count\n';
      data.type_data.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
      filename = 'data_types_distribution.csv';
    } else if (chartType === 'trend' && lineChartData.length > 0) {
      const headers = Object.keys(lineChartData[0]);
      csvContent = headers.join(',') + '\n';
      lineChartData.forEach(row => {
        csvContent += headers.map(h => row[h]).join(',') + '\n';
      });
      filename = 'numeric_trend_data.csv';
    } else if (chartType === 'columns' && columnStats.length > 0) {
      csvContent = 'Column,Missing,Filled,Total\n';
      columnStats.forEach(item => {
        csvContent += `${item.fullName},${item.missing},${item.filled},${item.total}\n`;
      });
      filename = 'column_statistics.csv';
    }

    if (csvContent) {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="visualizations-page" data-testid="visualizations-page">
      <div className="viz-header">
        <button className="btn btn-secondary" onClick={onBack} data-testid="back-to-dashboard">
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <h1>Data Visualizations</h1>
        <p>Comprehensive visual analysis of your dataset</p>
      </div>

      <div className="viz-grid">
        {/* Missing Values Bar Chart */}
        <div className="viz-card" data-testid="viz-missing-chart">
          <div className="viz-card-header">
            <div className="viz-title">
              <BarChart3 size={20} />
              Missing Values per Column
            </div>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => handleDownloadChartData('missing')}
              data-testid="download-missing-chart"
            >
              <Download size={14} />
              Download
            </button>
          </div>
          {data?.missing_data && data.missing_data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.missing_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#FFFFFF', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="missing" fill="#D90429" radius={[4, 4, 0, 0]} name="Missing Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="viz-empty">
              <Activity size={32} />
              <span>No missing values found - Great data quality!</span>
            </div>
          )}
        </div>

        {/* Data Types Pie Chart */}
        <div className="viz-card" data-testid="viz-types-chart">
          <div className="viz-card-header">
            <div className="viz-title">
              <PieChartIcon size={20} />
              Data Type Distribution
            </div>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => handleDownloadChartData('types')}
              data-testid="download-types-chart"
            >
              <Download size={14} />
              Download
            </button>
          </div>
          {data?.type_data && data.type_data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.type_data}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.type_data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="viz-empty">No data type information available</div>
          )}
        </div>

        {/* Numeric Trend Line Chart (Trading-style) */}
        <div className="viz-card viz-card-wide" data-testid="viz-trend-chart">
          <div className="viz-card-header">
            <div className="viz-title">
              <TrendingUp size={20} />
              Numeric Data Trend (First 20 Rows)
            </div>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => handleDownloadChartData('trend')}
              data-testid="download-trend-chart"
            >
              <Download size={14} />
              Download
            </button>
          </div>
          {lineChartData.length > 0 && numericColumns.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="index" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  label={{ value: 'Row Index', position: 'insideBottom', offset: -5 }}
                />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#FFFFFF', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                {numericColumns.map((col, index) => (
                  <Line 
                    key={col}
                    type="monotone" 
                    dataKey={col} 
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name={col.length > 15 ? col.substring(0, 15) + '...' : col}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="viz-empty">No numeric data available for trend analysis</div>
          )}
        </div>

        {/* Column Quality Area Chart */}
        <div className="viz-card viz-card-wide" data-testid="viz-columns-chart">
          <div className="viz-card-header">
            <div className="viz-title">
              <Activity size={20} />
              Column Data Quality (Filled vs Missing)
            </div>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => handleDownloadChartData('columns')}
              data-testid="download-columns-chart"
            >
              <Download size={14} />
              Download
            </button>
          </div>
          {columnStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={columnStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#FFFFFF', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [value, name === 'filled' ? 'Filled Values' : 'Missing Values']}
                />
                <Legend />
                <Area type="monotone" dataKey="filled" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.6} name="Filled Values" />
                <Area type="monotone" dataKey="missing" stackId="1" stroke="#D90429" fill="#D90429" fillOpacity={0.6} name="Missing Values" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="viz-empty">No column statistics available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizationsPage;
