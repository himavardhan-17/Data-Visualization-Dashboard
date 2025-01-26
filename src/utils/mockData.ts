import { DataPoint } from '../types';

export const generateMockData = (): DataPoint[] => {
  const categories = ['Revenue', 'Expenses', 'Profit'];
  const data: DataPoint[] = [];
  
  // Generate data for the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    categories.forEach(category => {
      data.push({
        date: date.toISOString().slice(0, 7), // YYYY-MM format
        value: Math.floor(Math.random() * 10000) + 1000,
        category,
      });
    });
  }
  
  return data;
};

export const processDataForCharts = (data: DataPoint[]) => {
  const categories = [...new Set(data.map(d => d.category))];
  const labels = [...new Set(data.map(d => d.date))].sort();
  
  const datasets = categories.map(category => ({
    label: category,
    data: labels.map(label => 
      data.find(d => d.category === category && d.date === label)?.value || 0
    ),
    backgroundColor: getRandomColor(),
    borderColor: getRandomColor(),
    fill: false,
  }));

  return { labels, datasets };
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};