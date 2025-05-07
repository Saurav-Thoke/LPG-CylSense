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

  // 🔑 Get Firebase User UID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("🔐 Logged in UID:", user.uid);
        setUid(user.uid);
      } else {
        toast.error("User not logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔁 Realtime Sensor Data Fetching (every 6 seconds)
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        // const res = await axios.get(process.env.REACT_APP_API, { timeout: 10000 });
        const res = await axios.get(process.env.REACT_APP_BACKEND, { timeout: 20000 });
        const data = res.data;

        console.log("📡 Live Sensor Data:", data);
        if (data && typeof data.weight !== "undefined") {
          setWeight(data.weight);
          setIsLeaking(data.gas_detected === true);
        } else {
          console.warn("⚠️ Unexpected response format from sensor:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching sensor data:", error);
        toast.error("Failed to fetch live sensor data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 6000);

    return () => clearInterval(interval);
  }, []);

  // 📈 Fetch Cylinder Weight History for Chart
  useEffect(() => {
    const fetchChartData = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const uid = user.uid;

      try {
        const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URI}/api/cylinders/${uid}`);
        const rawData = response.data;
        const cylinders = Array.isArray(rawData) ? rawData : rawData.entries || [];

        console.log("CYLINDER------------", cylinders);

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
        console.error("📉 Chart fetch error:", err);
      }
    };

    fetchChartData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: "#374151" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#6B7280" },
        grid: { display: false },
      },
      y: {
        min: 0,
        max: 14.2,
        ticks: {
          color: "#6B7280",
          stepSize: 2,
          callback: function (value) {
            return value + " kg";
          },
        },
        grid: { color: "#E5E7EB" },
      },
    },
  };
  

  const gasLevelPercent = (weight / capacity) * 100;
  let gasLevelColor = gasLevelPercent >= 60 ? "green" : gasLevelPercent >= 20 ? "orange" : "red";

  // 🌀 Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <p className="text-gray-600 text-lg font-medium">Fetching sensor data...</p>
        </div>
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
          <div className="overflow-x-auto w-full">
            {chartData ? (
              <div className="min-w-[800px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-gray-500">Loading chart data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
