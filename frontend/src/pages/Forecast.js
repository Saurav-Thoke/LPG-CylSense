// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const Forecast = () => {
//   const [currentLevel, setCurrentLevel] = useState(35); // In %
//   const [daysLeft, setDaysLeft] = useState(4); // Days until refill needed
//   const [forecastData, setForecastData] = useState([]);

//   useEffect(() => {
//     // Dummy forecast data - replace this with actual API call later
//     const dummyData = [
//       { date: "Mon", level: 75 },
//       { date: "Tue", level: 60 },
//       { date: "Wed", level: 50 },
//       { date: "Thu", level: 42 },
//       { date: "Fri", level: 35 },
//     ];
//     setForecastData(dummyData);

//     // Simulate warning if gas level is low
//     if (currentLevel <= 30) {
//       toast.warning("⚠️ Your gas level is low. Consider ordering a refill!");
//     }
//   }, [currentLevel]);

//   const handleRefillClick = () => {
//     toast.success("Refill request sent!");
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-10 px-6">
//       <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
//         <h2 className="text-2xl font-bold text-blue-600">Forecast Overview</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Current Level */}
//           <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
//             <p className="text-gray-700 text-lg">Current Gas Level:</p>
//             <p className={`text-3xl font-bold ${currentLevel <= 30 ? "text-red-500" : "text-green-600"}`}>
//               {currentLevel}%
//             </p>
//           </div>

//           {/* Predicted Days */}
//           <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
//             <p className="text-gray-700 text-lg">Estimated Days Left:</p>
//             <p className="text-3xl font-bold text-yellow-600">{daysLeft} days</p>
//           </div>
//         </div>

//         {/* Forecast Chart */}
//         <div className="h-72">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={forecastData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis domain={[0, 100]} />
//               <Tooltip />
//               <Line type="monotone" dataKey="level" stroke="#2563eb" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Refill Suggestion */}
//         {currentLevel <= 30 && (
//           <button
//             onClick={handleRefillClick}
//             className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
//           >
//             Request Refill
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Forecast;


// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import axios from "axios";
// import { getAuth } from "firebase/auth";

// const Forecast = () => {
//   const [forecastData, setForecastData] = useState([]);
//   const [currentLevel, setCurrentLevel] = useState(0);
//   const [daysLeft, setDaysLeft] = useState(0);

//   useEffect(() => {
//     const fetchCylinderData = async () => {
//       const user = getAuth().currentUser;
//       if (!user) {
//         toast.error("User not logged in.");
//         return;
//       }

//       const uid = user.uid;

//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/cylinders/${uid}`
//         );
//         const cylinders = response.data;

//         // Format data for chart
//         const formatted = cylinders.map((item, i) => ({
//           date: item.trackDate,
//           level: parseFloat(((item.cylinderWeight / 14.2) * 100).toFixed(1)),
//         }));

//         setForecastData(formatted);

//         // Set current level from the latest entry
//         const latest = formatted[formatted.length - 1];
//         setCurrentLevel(latest.level);

//         // Estimate how many days left based on drop rate
//         if (formatted.length >= 2) {
//           const diff = formatted[formatted.length - 2].level - latest.level;
//           const dailyUsage = diff > 0 ? diff : 0.5; // fallback usage
//           const days = Math.floor(latest.level / dailyUsage);
//           setDaysLeft(days);
//         } else {
//           setDaysLeft(5); // fallback if not enough data
//         }
//       } catch (err) {
//         toast.error("Error fetching cylinder data.");
//         console.error(err);
//       }
//     };

//     fetchCylinderData();
//   }, []);

//   const handleRefillClick = () => {
//     toast.success("Refill request sent!");
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-10 px-6">
//       <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
//         <h2 className="text-2xl font-bold text-blue-600">Forecast Overview</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Current Level */}
//           <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
//             <p className="text-gray-700 text-lg">Current Gas Level:</p>
//             <p
//               className={`text-3xl font-bold ${
//                 currentLevel <= 30 ? "text-red-500" : "text-green-600"
//               }`}
//             >
//               {currentLevel}%
//             </p>
//           </div>

//           {/* Predicted Days */}
//           <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
//             <p className="text-gray-700 text-lg">Estimated Days Left:</p>
//             <p className="text-3xl font-bold text-yellow-600">
//               {daysLeft} days
//             </p>
//           </div>
//         </div>

//         {/* Forecast Chart */}
//         <div className="h-72">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={forecastData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis domain={[0, 100]} />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="level"
//                 stroke="#2563eb"
//                 strokeWidth={3}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Refill Suggestion */}
//         {currentLevel <= 30 && (
//           <button
//             onClick={handleRefillClick}
//             className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
//           >
//             Request Refill
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Forecast;


import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { getAuth } from "firebase/auth";

const Forecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [loading, setLoading] = useState(true); // 👈 Add loading state

  useEffect(() => {
    const fetchCylinderData = async () => {
      const user = getAuth().currentUser;
      if (!user) {
        toast.error("User not logged in.");
        setLoading(false);
        return;
      }

      const uid = user.uid;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/cylinders/${uid}`
        );
        const cylinders = response.data;

        const formatted = cylinders.map((item) => ({
          date: item.trackDate,
          level: parseFloat(((item.cylinderWeight / 14.2) * 100).toFixed(1)),
        }));

        setForecastData(formatted);

        const latest = formatted[formatted.length - 1];
        setCurrentLevel(latest.level);

        if (formatted.length >= 2) {
          const diff = formatted[formatted.length - 2].level - latest.level;
          const dailyUsage = diff > 0 ? diff : 0.5;
          const days = Math.floor(latest.level / dailyUsage);
          setDaysLeft(days);
        } else {
          setDaysLeft(5);
        }
      } catch (err) {
        toast.error("Error fetching cylinder data.");
        console.error(err);
      } finally {
        setLoading(false); // 👈 Stop loading
      }
    };

    fetchCylinderData();
  }, []);

  const handleRefillClick = () => {
    toast.success("Refill request sent!");
  };

  // ⏳ Show Spinner While Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-blue-600">Forecast Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
            <p className="text-gray-700 text-lg">Current Gas Level:</p>
            <p
              className={`text-3xl font-bold ${
                currentLevel <= 30 ? "text-red-500" : "text-green-600"
              }`}
            >
              {currentLevel}%
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
            <p className="text-gray-700 text-lg">Estimated Days Left:</p>
            <p className="text-3xl font-bold text-yellow-600">
              {daysLeft} days
            </p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="level"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {currentLevel <= 30 && (
          <button
            onClick={handleRefillClick}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Request Refill
          </button>
        )}
      </div>
    </div>
  );
};

export default Forecast;
