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
        console.log("🔐 Logged in UID:", user.uid); // ✅ Log UID
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
        const res = await axios.get("http://192.168.0.3/data", { timeout: 10000 }); // 10 seconds timeout
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

    fetchLiveData(); // Initial call
    const interval = setInterval(fetchLiveData, 6000); // Poll every 6 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);

  // 📈 Fetch Cylinder Weight History for Chart
  useEffect(() => {
    const fetchChartData = async () => {
      if (!uid) return;

      try {
        const response = await fetch(`http://localhost:5000/api/cylinders/${uid}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const cylinders = await response.json();

        console.log("📊 Cylinder History Data:", cylinders); // ✅ Log chart data

        const labels = cylinders.map(({ trackDate }) =>
          new Date(trackDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );
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
        console.error("📉 Chart fetch error:", err); // ❌ Log chart fetch error
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
  let gasLevelColor = gasLevelPercent >= 60 ? "green" : gasLevelPercent >= 20 ? "orange" : "red";

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
