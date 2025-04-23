

// import GasLevelCard from "../components/GasLevelCard";
// import LeakStatusCard from "../components/LeakStatusCard";
// import ForecastCard from "../components/ForecastCard";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend
// );

// export default function Dashboard() {
//   const weight = 14;
//   const capacity = 14.2;
//   const gasLevelPercent = (weight / capacity) * 100;

//   let gasLevelColor = "";
//   if (gasLevelPercent >= 60) {
//     gasLevelColor = "green";
//   } else if (gasLevelPercent < 60 && gasLevelPercent >= 20) {
//     gasLevelColor = "orange";
//   } else {
//     gasLevelColor = "red";
//   }

//   const usageData = {
//     labels: ["Apr 1", "Apr 5", "Apr 10", "Apr 15", "Apr 20"],
//     datasets: [
//       {
//         label: "Gas Weight (kg)",
//         data: [14.2, 12.5, 10.4, 8.2, 6.1],
//         borderColor: "#3B82F6",
//         backgroundColor: "rgba(59, 130, 246, 0.1)",
//         tension: 0.3,
//         fill: true,
//         pointRadius: 5,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//         labels: {
//           color: "#374151",
//         },
//       },
//     },
//     scales: {
//       x: {
//         ticks: { color: "#6B7280" },
//         grid: { display: false },
//       },
//       y: {
//         ticks: { color: "#6B7280" },
//         grid: { color: "#E5E7EB" },
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 flex flex-row gap-6">
//       {/* Left: Vertical Cards */}
//       <div className="flex flex-col gap-6 w-full max-w-xs">
//         <div className="transform transition-transform duration-300 hover:scale-105">
//           <GasLevelCard weight={weight} capacity={capacity} color={gasLevelColor} />
//         </div>
//         <div className="transform transition-transform duration-300 hover:scale-105">
//           <LeakStatusCard isLeaking={true} />
//         </div>
//         <div className="transform transition-transform duration-300 hover:scale-105">
//           <ForecastCard predictedDate="April 15, 2025" />
//         </div>
//       </div>

//       {/* Right: Graph */}
//       <div className="flex-1 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Trend</h2>
//         <Line data={usageData} options={chartOptions} />
//       </div>
//     </div>
//   );
// }



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
  const weight = 14;
  const capacity = 14.2;
  const gasLevelPercent = (weight / capacity) * 100;

  let gasLevelColor = "";
  if (gasLevelPercent >= 60) {
    gasLevelColor = "green";
  } else if (gasLevelPercent >= 20) {
    gasLevelColor = "orange";
  } else {
    gasLevelColor = "red";
  }

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
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cards layout logic */}
        <div className="flex flex-col md:flex-row lg:flex-col w-full lg:max-w-xs gap-6">
          {/* Left Column (Gas Level Card) */}
          <div className="transform transition-transform duration-300 hover:scale-105 md:w-1/2 lg:w-full">
            <GasLevelCard weight={weight} capacity={capacity} color={gasLevelColor} />
          </div>

          {/* Right Column for md screen (Leak + Forecast) */}
          <div className="flex flex-col gap-6 md:w-1/2 lg:w-full">
            <div className="transform transition-transform duration-300 hover:scale-105">
              <LeakStatusCard isLeaking={true} />
            </div>
            <div className="transform transition-transform duration-300 hover:scale-105">
              <ForecastCard predictedDate="April 15, 2025" />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full lg:flex-1 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Trend</h2>
          <Line data={usageData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
