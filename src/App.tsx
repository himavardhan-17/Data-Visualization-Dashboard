import React, { useState, useEffect } from 'react';
import ChartContainer from './components/ChartContainer';
import DataControls from './components/DataControls';
import { processFile, processDataForCharts } from './utils/fileProcessing';
import { DataPoint, ColumnSelection } from './types';
import { BarChart, LineChart, ScatterChart, PieChart, Gauge, Activity } from 'lucide-react';

type ChartType = 'line' | 'bar' | 'scatter' | 'pie' | 'doughnut' | 'polar' | 'radar';

function App() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [filter, setFilter] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [columnSelection, setColumnSelection] = useState<ColumnSelection>({
    xAxis: '',
    yAxis: '',
  });
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('line');

  useEffect(() => {
    if (data.length > 0) {
      const newColumns = Object.keys(data[0]);
      setColumns(newColumns);
      setColumnSelection({
        xAxis: newColumns[0],
        yAxis: newColumns[1],
      });
    }
  }, [data]);

  useEffect(() => {
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [filter, data]);

  const handleFileUpload = async (file: File) => {
    try {
      const processedData = await processFile(file);
      setData(processedData);
      setFilteredData(processedData);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the file format and try again.');
    }
  };

  const handleExport = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      columns.join(',') + '\n' +
      filteredData.map(row => 
        columns.map(col => row[col]).join(',')
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dashboard_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = processDataForCharts(
    filteredData,
    columnSelection.xAxis,
    columnSelection.yAxis,
    columnSelection.groupBy
  );

  const chartTypes: { type: ChartType; icon: React.ReactNode; label: string }[] = [
    { type: 'line', icon: <LineChart className="text-blue-500" />, label: 'Line Chart' },
    { type: 'bar', icon: <BarChart className="text-green-500" />, label: 'Bar Chart' },
    { type: 'scatter', icon: <ScatterChart className="text-purple-500" />, label: 'Scatter Plot' },
    { type: 'pie', icon: <PieChart className="text-red-500" />, label: 'Pie Chart' },
    { type: 'doughnut', icon: <Gauge className="text-orange-500" />, label: 'Doughnut Chart' },
    { type: 'radar', icon: <Activity className="text-indigo-500" />, label: 'Radar Chart' },
    { type: 'polar', icon: <PieChart className="text-pink-500" />, label: 'Polar Area Chart' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Visualization Dashboard</h1>
          <p className="text-gray-600">Upload your CSV or Excel file to visualize the data</p>
        </div>

        <DataControls
          onFileUpload={handleFileUpload}
          onFilterChange={setFilter}
          onExport={handleExport}
          data={data}
          onColumnSelect={setColumnSelection}
          columns={columns}
        />

        {data.length > 0 ? (
          <>
            <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Select Chart Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {chartTypes.map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChartType(type)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                      selectedChartType === type
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    {icon}
                    <span className="mt-2 text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <ChartContainer
                type={selectedChartType}
                data={chartData}
                title={`${columnSelection.yAxis} vs ${columnSelection.xAxis}`}
              />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">
              Upload a CSV or Excel file to start visualizing your data.
              The file should contain columns with numerical data for visualization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;