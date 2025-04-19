import GasLevelCard from "../components/GasLevelCard";
import LeakStatusCard from "../components/LeakStatusCard";
import ForecastCard from "../components/ForecastCard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const usageData = {
    labels: ["Apr 1", "Apr 5", "Apr 10", "Apr 15", "Apr 20"],
    datasets: [
      {
        label: "Gas Weight (kg)",
        data: [14.2, 12.5, 10.4, 8.2, 6.1],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        fill: true,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#374151",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6B7280" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#6B7280" },
        grid: { color: "#E5E7EB" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="transform transition-transform duration-300 hover:scale-105">
          <GasLevelCard weight={12.5} capacity={14.2} />
        </div>
        <div className="transform transition-transform duration-300 hover:scale-105">
          <LeakStatusCard isLeaking={false} />
        </div>
        <div className="transform transition-transform duration-300 hover:scale-105">
          <ForecastCard predictedDate="April 15, 2025" />
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Trend</h2>
        <Line data={usageData} options={chartOptions} />
      </div>
    </div>
  );
}