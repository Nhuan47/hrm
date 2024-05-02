import { useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChart = ({ chartData }) => {
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
      <Pie options={chartOptions} data={chartData} />
    </div>
  );
};
