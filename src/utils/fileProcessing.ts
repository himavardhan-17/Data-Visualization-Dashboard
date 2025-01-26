import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DataPoint } from '../types';

export const processFile = (file: File): Promise<DataPoint[]> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          resolve(results.data as DataPoint[]);
        },
        error: (error) => {
          reject(error);
        }
      });
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData as DataPoint[]);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    } else {
      reject(new Error('Unsupported file format'));
    }
  });
};

export const processDataForCharts = (
  data: DataPoint[],
  xAxis: string,
  yAxis: string,
  groupBy?: string
) => {
  if (!data.length) return { labels: [], datasets: [] };

  if (groupBy) {
    const groups = new Map<string, { x: string; y: number }[]>();
    
    data.forEach(point => {
      const groupValue = String(point[groupBy]);
      const xValue = String(point[xAxis]);
      const yValue = Number(point[yAxis]);
      
      if (!groups.has(groupValue)) {
        groups.set(groupValue, []);
      }
      groups.get(groupValue)?.push({ x: xValue, y: yValue });
    });

    const labels = [...new Set(data.map(point => String(point[xAxis])))].sort();
    const datasets = Array.from(groups.entries()).map(([groupName, points]) => ({
      label: groupName,
      data: labels.map(label => 
        points.find(p => p.x === label)?.y || 0
      ),
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      fill: false,
    }));

    return { labels, datasets };
  } else {
    const labels = data.map(point => String(point[xAxis]));
    const datasets = [{
      label: yAxis,
      data: data.map(point => Number(point[yAxis])),
      backgroundColor: getRandomColors(labels.length),
      borderColor: getRandomColor(),
      fill: false,
    }];

    return { labels, datasets };
  }
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getRandomColors = (count: number) => {
  return Array(count).fill(0).map(() => getRandomColor());
};