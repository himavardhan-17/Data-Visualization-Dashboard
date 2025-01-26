import React from 'react';
import { Download, Upload, Filter } from 'lucide-react';
import { saveAs } from 'file-saver';
import { DataPoint, ColumnSelection } from '../types';

interface DataControlsProps {
  onFileUpload: (file: File) => void;
  onFilterChange: (filter: string) => void;
  onExport: () => void;
  data: DataPoint[];
  onColumnSelect: (selection: ColumnSelection) => void;
  columns: string[];
}

const DataControls: React.FC<DataControlsProps> = ({
  onFileUpload,
  onFilterChange,
  onExport,
  data,
  onColumnSelect,
  columns,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filter data..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onFilterChange(e.target.value)}
            />
          </div>
        </div>
        <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
          <Upload size={18} className="mr-2" />
          Upload File
          <input
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
          />
        </label>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          disabled={!data.length}
        >
          <Download size={18} className="mr-2" />
          Export
        </button>
      </div>

      {columns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              X-Axis
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onColumnSelect({
                xAxis: e.target.value,
                yAxis: document.getElementById('yAxis')?.value || columns[0],
                groupBy: document.getElementById('groupBy')?.value
              })}
              id="xAxis"
            >
              {columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Y-Axis
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onColumnSelect({
                xAxis: document.getElementById('xAxis')?.value || columns[0],
                yAxis: e.target.value,
                groupBy: document.getElementById('groupBy')?.value
              })}
              id="yAxis"
            >
              {columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group By (Optional)
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onColumnSelect({
                xAxis: document.getElementById('xAxis')?.value || columns[0],
                yAxis: document.getElementById('yAxis')?.value || columns[0],
                groupBy: e.target.value === '' ? undefined : e.target.value
              })}
              id="groupBy"
            >
              <option value="">None</option>
              {columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataControls;