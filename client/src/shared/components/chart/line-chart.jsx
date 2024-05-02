import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useRef } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineChart = ({ chartData }) => {
  const chartRef = useRef(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          useBorderRadius: true,
          borderRadius: 10,
          padding: 30,
        },
        title: {
          display: false,
        },
      },
    },
    layout: {
      padding: 10,
    },
  };

  if (!chartData) return null;
  return (
    <div ref={chartRef} className="w-[99%] h-full">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default LineChart;
