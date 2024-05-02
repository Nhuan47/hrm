import { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ chartData }) => {
  const chartRef = useRef(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          boxWidth: 60,
          boxHeight: 20,
        },
      },
      tooltip: {},

      //   title: {
      //     display: true,
      //     text: title,
      //   },
    },
    layout: {
      padding: 0,
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (!chartData) return null;
  return (
    <div ref={chartRef} className="w-[99%] h-full">
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
};
