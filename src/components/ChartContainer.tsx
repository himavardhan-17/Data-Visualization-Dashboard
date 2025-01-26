import React from 'react';
import { Line, Bar, Scatter, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

interface ChartContainerProps {
  type: 'line' | 'bar' | 'scatter' | 'pie' | 'doughnut' | 'polar' | 'radar';
  data: ChartData;
  title: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ type, data, title }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy' as const,
        },
        pan: {
          enabled: true,
          mode: 'xy' as const,
        },
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'scatter':
        return <Scatter data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      case 'polar':
        return <PolarArea data={data} options={options} />;
      case 'radar':
        return <Radar data={data} options={options} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {renderChart()}
    </div>
  );
};

export default ChartContainer;