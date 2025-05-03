// import { useEffect, useState } from "react";
// import GasLevelCard from "../components/GasLevelCard";
// import LeakStatusCard from "../components/LeakStatusCard";
// import ForecastCard from "../components/ForecastCard";
// import { Line } from "react-chartjs-2";
// import axios from "axios";
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
//   const capacity = 14.2;
//   const [weight, setWeight] = useState(0);
//   const [isLeaking, setIsLeaking] = useState(false);
//   const [loading, setLoading] = useState(true); // 👈 new

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://192.168.0.5:5000/data");
//         const data = await response.json();
//         console.log("Fetched API data:", data);
//         setWeight(data.weight);
//         setIsLeaking(data.gas !== "Safe");
//         setLoading(false); // 👈 set loading false after data fetch
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false); // still hide loader if error
//       }
//     };

//     fetchData();
//     const interval = setInterval(fetchData, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const gasLevelPercent = (weight / capacity) * 100;
//   let gasLevelColor = "";
//   if (gasLevelPercent >= 60) gasLevelColor = "green";
//   else if (gasLevelPercent >= 20) gasLevelColor = "orange";
//   else gasLevelColor = "red";

//   // const usageData = {
//   //   labels: ["Apr 1", "Apr 5", "Apr 10", "Apr 15", "Apr 20"],
//   //   datasets: [
//   //     {
//   //       label: "Gas Weight (kg)",
//   //       data: [14.2, 12.5, 10.4, 8.2, 6.1],
//   //       borderColor: "#3B82F6",
//   //       backgroundColor: "rgba(59, 130, 246, 0.1)",
//   //       tension: 0.3,
//   //       fill: true,
//   //       pointRadius: 5,
//   //     },
//   //   ],
//   // };

//   // const chartOptions = {
//   //   responsive: true,
//   //   plugins: {
//   //     legend: {
//   //       display: true,
//   //       labels: { color: "#374151" },
//   //     },
//   //   },
//   //   scales: {
//   //     x: { ticks: { color: "#6B7280" }, grid: { display: false } },
//   //     y: { ticks: { color: "#6B7280" }, grid: { color: "#E5E7EB" } },
//   //   },
//   // }; 

//   let usageData = {
//     labels: [],
//     datasets: [
//       {
//         label: "Gas Weight (kg)",
//         data: [],
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
//         labels: { color: "#374151" },
//       },
//     },
//     scales: {
//       x: { ticks: { color: "#6B7280" }, grid: { display: false } },
//       y: { ticks: { color: "#6B7280" }, grid: { color: "#E5E7EB" } },
//     },
//   };

//   const fetchChartData = async (email) => {
//     const res = await axios.get(`/api/cylinders/${email}`);
//     const data = res.data;

//     usageData.labels = data.map((entry) =>
//       new Date(entry.createdAt).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       })
//     );

//     usageData.datasets[0].data = data.map((entry) => entry.cylinderWeight);
//   };
//   // if (loading) {
//   //   return (
//   //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//   //       <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="flex flex-col lg:flex-row gap-6">
//         <div className="flex flex-col md:flex-row lg:flex-col w-full lg:max-w-xs gap-6">
//           <div className="transform transition-transform duration-300 hover:scale-105 md:w-1/2 lg:w-full">
//             <GasLevelCard weight={weight} capacity={capacity} color={gasLevelColor} />
//           </div>
//           <div className="flex flex-col gap-6 md:w-1/2 lg:w-full">
//             <div className="transform transition-transform duration-300 hover:scale-105">
//               <LeakStatusCard isLeaking={isLeaking} />
//             </div>
//             <div className="transform transition-transform duration-300 hover:scale-105">
//               <ForecastCard predictedDate="April 15, 2025" />
//             </div>
//           </div>
//         </div>
//         <div className="w-full lg:flex-1 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Trend</h2>
//           <Line data={usageData} options={chartOptions} />
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { auth } from "../firebase";
// import { toast } from "react-toastify";
// import GasLevelCard from "../components/GasLevelCard";
// import LeakStatusCard from "../components/LeakStatusCard";
// import ForecastCard from "../components/ForecastCard";
// import { Line } from "react-chartjs-2";
// import axios from "axios";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { getAuth } from "firebase/auth";

// ChartJS.register(
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend
// );

// export default function Dashboard() {
//   const capacity = 14.2;
//   const [weight, setWeight] = useState(0);
//   const [isLeaking, setIsLeaking] = useState(false);
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [uid, setUid] = useState(null);

//   // Get Firebase User UID
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setUid(user.uid);
//       } else {
//         toast.error("User not logged in");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch Live Sensor Data
//   useEffect(() => {
//     const fetchLiveData = async () => {
//       try {
//         const response = await fetch("http://192.168.0.5:5000/data");
//         const data = await response.json();
//         setWeight(data.weight);
//         setIsLeaking(data.gas !== "Safe");
//         setLoading(false);
//       } catch (error) {
//         toast.error("Failed to fetch live sensor data.");
//         setLoading(false);
//       }
//     };

//     fetchLiveData();
//     const interval = setInterval(fetchLiveData, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   // Fetch Chart Data based on UID
//   useEffect(() => {
//     const fetchChartData = async () => {
//       if (!uid) return;

//       try {
//         const user = getAuth().currentUser;
//         if (!user) return;
//         console.log("----------------------", user.uid);

//         const uid = user.uid;

//         const response = await axios.get(`http://localhost:5000/api/cylinders/${uid}`);
//         const cylinders = response.data;  // assuming backend sends array here

//         const labels = cylinders.map(({ trackDate }) => trackDate);
//         const weights = cylinders.map(({ cylinderWeight }) => cylinderWeight);

//         //        console.log(data);

//         // // trackDate is already a formatted string from backend
//         // const labels = data.map(({ trackDate }) => trackDate);
//         // const weights = data.map(({ cylinderWeight }) => cylinderWeight);

//         setChartData({
//           labels,
//           datasets: [
//             {
//               label: "Gas Weight (kg)",
//               data: weights,
//               borderColor: "#3B82F6",
//               backgroundColor: "rgba(59, 130, 246, 0.1)",
//               tension: 0.3,
//               fill: true,
//               pointRadius: 5,
//             },
//           ],
//         });
//       } catch (err) {
//         toast.error("Error fetching chart data.");
//         console.error(err);
//       }
//     };

//     fetchChartData();
//   }, [uid]);

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//         labels: { color: "#374151" },
//       },
//     },
//     scales: {
//       x: { ticks: { color: "#6B7280" }, grid: { display: false } },
//       y: { ticks: { color: "#6B7280" }, grid: { color: "#E5E7EB" } },
//     },
//   };

//   const gasLevelPercent = (weight / capacity) * 100;
//   let gasLevelColor = "";
//   if (gasLevelPercent >= 60) gasLevelColor = "green";
//   else if (gasLevelPercent >= 20) gasLevelColor = "orange";
//   else gasLevelColor = "red";

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="flex flex-col lg:flex-row gap-6">
//         <div className="flex flex-col md:flex-row lg:flex-col w-full lg:max-w-xs gap-6">
//           <div className="transform transition-transform duration-300 hover:scale-105 md:w-1/2 lg:w-full">
//             <GasLevelCard weight={weight} capacity={capacity} color={gasLevelColor} />
//           </div>
//           <div className="flex flex-col gap-6 md:w-1/2 lg:w-full">
//             <div className="transform transition-transform duration-300 hover:scale-105">
//               <LeakStatusCard isLeaking={isLeaking} />
//             </div>
//             <div className="transform transition-transform duration-300 hover:scale-105">
//               <ForecastCard predictedDate="May 10, 2025" />
//             </div>
//           </div>
//         </div>
//         <div className="w-full lg:flex-1 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Trend</h2>
//           {chartData ? (
//             <Line data={chartData} options={chartOptions} />
//           ) : (
//             <p className="text-gray-500">Loading chart data...</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import GasLevelCard from "../components/GasLevelCard";
import LeakStatusCard from "../components/LeakStatusCard";
import ForecastCard from "../components/ForecastCard";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getAuth } from "firebase/auth";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const capacity = 14.2;
  const [weight, setWeight] = useState(0);
  const [isLeaking, setIsLeaking] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);

  // Get Firebase User UID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      } else {
        toast.error("User not logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch Live Sensor Data
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch("http://192.168.0.5:5000/data");
        const data = await response.json();
        setWeight(data.weight);
        setIsLeaking(data.gas !== "Safe");
      } catch (error) {
        toast.error("Failed to fetch live sensor data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Chart Data
  useEffect(() => {
    const fetchChartData = async () => {
      if (!uid) return;

      try {
        const user = getAuth().currentUser;
        if (!user) return;

        const response = await axios.get(`http://localhost:5000/api/cylinders/${uid}`);
        const cylinders = response.data;

        const labels = cylinders.map(({ trackDate }) => trackDate);
        const weights = cylinders.map(({ cylinderWeight }) => cylinderWeight);

        setChartData({
          labels,
          datasets: [
            {
              label: "Gas Weight (kg)",
              data: weights,
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.3,
              fill: true,
              pointRadius: 5,
            },
          ],
        });
      } catch (err) {
        toast.error("Error fetching chart data.");
        console.error(err);
      }
    };

    fetchChartData();
  }, [uid]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: "#374151" },
      },
    },
    scales: {
      x: { ticks: { color: "#6B7280" }, grid: { display: false } },
      y: { ticks: { color: "#6B7280" }, grid: { color: "#E5E7EB" } },
    },
  };

  const gasLevelPercent = (weight / capacity) * 100;
  let gasLevelColor = "";
  if (gasLevelPercent >= 60) gasLevelColor = "green";
  else if (gasLevelPercent >= 20) gasLevelColor = "orange";
  else gasLevelColor = "red";

  // ⏳ Show Spinner While Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col md:flex-row lg:flex-col w-full lg:max-w-xs gap-6">
          <div className="transform transition-transform duration-300 hover:scale-105 md:w-1/2 lg:w-full">
            <GasLevelCard weight={weight} capacity={capacity} color={gasLevelColor} />
          </div>
          <div className="flex flex-col gap-6 md:w-1/2 lg:w-full">
            <div className="transform transition-transform duration-300 hover:scale-105">
              <LeakStatusCard isLeaking={isLeaking} />
            </div>
            <div className="transform transition-transform duration-300 hover:scale-105">
              <ForecastCard predictedDate="May 10, 2025" />
            </div>
          </div>
        </div>
        <div className="w-full lg:flex-1 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Trend</h2>
          {chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p className="text-gray-500">Loading chart data...</p>
          )}
        </div>
      </div>
    </div>
  );
}
