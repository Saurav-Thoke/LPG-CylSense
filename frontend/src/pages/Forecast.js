

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
  const [latestWeight, setLatestWeight] = useState(0); // 🆕 weight left
  const [daysLeft, setDaysLeft] = useState(0);
  const [predictedDate, setPredictedDate] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const response = await axios.get(`${process.env.REACT_APP_DOMAIN_URI}/api/cylinders/${uid}`);
        const data = response.data;

        const cylinders = Array.isArray(data) ? data : data.entries || [];
        const predictedEmptyDate = data.predictedEmptyDate || null;

        const formatted = cylinders.map((item) => ({
          date: item.trackDate,
          level: parseFloat(((item.cylinderWeight / 14.2) * 100).toFixed(1)),
          weight: item.cylinderWeight,
        }));

        setForecastData(formatted);

        if (formatted.length > 0) {
          const latest = formatted[formatted.length - 1];
          setCurrentLevel(latest.level);
          setLatestWeight(latest.weight); // 🆕 set weight

          if (formatted.length >= 2) {
            let totalUsage = 0;
            let totalDays = 0;

            for (let i = 1; i < formatted.length; i++) {
              const prev = formatted[i - 1];
              const curr = formatted[i];

              const prevDate = new Date(prev.date);
              const currDate = new Date(curr.date);

              const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
              const usage = prev.level - curr.level;

              if (usage > 0 && dayDiff > 0) {
                totalUsage += usage;
                totalDays += dayDiff;
              }
            }

            const avgDailyUsage = totalUsage > 0 && totalDays > 0 ? totalUsage / totalDays : 0.5;
            const days = Math.floor(latest.level / avgDailyUsage);
            setDaysLeft(days);
          } else {
            setDaysLeft(5);
          }
        }

        if (predictedEmptyDate) {
          setPredictedDate(predictedEmptyDate);

          const today = new Date();
          const predDate = new Date(predictedEmptyDate);
          const diffDays = Math.ceil((predDate - today) / (1000 * 60 * 60 * 24));

          if (diffDays <= 2 && diffDays >= 0) {
            toast.warn(`⚠️ Gas may run out in ${diffDays} day(s)!`);
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Cylinder Alert", {
                body: `Gas may run out by ${predictedEmptyDate}`,
              });
            }
          }
        }

      } catch (err) {
        toast.error("Error fetching cylinder data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCylinderData();
  }, []);

  const handleRefillClick = () => {
    toast.success("Refill request sent!");
  };

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
          {/* Current Gas Level with Weight */}
          <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
            <p className="text-gray-700 text-lg">Current Gas Level:</p>
            <p
              className={`text-3xl font-bold ${
                currentLevel <= 30 ? "text-red-500" : "text-green-600"
              }`}
            >
              {currentLevel}% 
            </p>
            <p
              className={`text-1xl font-bold ${
                currentLevel <= 30 ? "text-red-500" : "text-green-600"
              }`}
            >
               ({latestWeight} kg left)
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
            <p className="text-gray-700 text-lg">Estimated Days Left:</p>
            <p className="text-3xl font-bold text-yellow-600">{daysLeft} days</p>
          </div>

          {predictedDate && (
            <div className="p-4 bg-green-50 rounded-lg shadow-sm col-span-1 md:col-span-2">
              <p className="text-gray-700 text-lg">Predicted Empty Date:</p>
              <p className="text-xl font-semibold text-green-700">{predictedDate}</p>
            </div>
          )}
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="level" stroke="#2563eb" strokeWidth={3} />
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
