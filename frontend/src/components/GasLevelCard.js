// import React from "react";

// const GasLevelCard = ({ weight, capacity }) => {
//   const percentFilled = ((weight / capacity) * 100).toFixed(0);

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
//       <h3 className="text-lg font-semibold text-gray-700 mb-2">Gas Level</h3>
//       <p className="text-2xl font-bold text-blue-600 mb-1">{weight} kg</p>
//       <p className="text-sm text-gray-500">of {capacity} kg</p>

//       <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
//         <div
//           className="bg-blue-500 h-3 rounded-full"
//           style={{ width: `${percentFilled}%` }}
//         />
//       </div>
//       <p className="text-right text-xs text-gray-400 mt-1">
//         {percentFilled}% Full
//       </p>
//     </div>
//   );
// };

// export default GasLevelCard;


// export default function GasLevelCard({ weight, capacity, color }) {
//   const percent = ((weight / capacity) * 100).toFixed(1);

//   const colorClass = {
//     green: "text-green-600",
//     orange: "text-yellow-600",
//     red: "text-red-600",
//   }[color] || "text-gray-700";

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-6">
//       <h2 className="text-lg font-semibold text-gray-700 mb-2">Gas Level</h2>
//       <p className={`text-3xl font-bold ${colorClass}`}>
//       {percent}% full
//       </p>
//       <p className="text-gray-700">Capacity: {capacity} kg</p>
//       <p className={`mt-2 font-semibold ${colorClass}`}>
       
//         {weight} kg left
//       </p>
//     </div>
//   );
// }


import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GasLevelCard({ weight, capacity, color }) {
  const percent = ((weight / capacity) * 100).toFixed(1);
  const remaining = capacity - weight;

  const colorMap = {
    green: "#16A34A",
    yellow: "#FACC15",
    orange: "#F97316",
    red: "#DC2626",
  };

  const colorClass = {
    green: "text-green-600",
    yellow: "text-yellow-500",
    orange: "text-orange-500",
    red: "text-red-600",
  }[color] || "text-gray-700";

  const doughnutData = {
    labels: ["Remaining", "Used"],
    datasets: [
      {
        data: [weight, remaining],
        backgroundColor: [colorMap[color] || "#9CA3AF", "#E5E7EB"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Gas Level</h2>
      <div className="relative w-32 h-32 mb-4">
        <Doughnut data={doughnutData} options={doughnutOptions} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${colorClass}`}>{percent}%</span>
        </div>
      </div>
      <p className="text-gray-700">Capacity: {capacity} kg</p>
      <p className={`mt-1 font-semibold ${colorClass}`}>{weight} kg left</p>
    </div>
  );
}
