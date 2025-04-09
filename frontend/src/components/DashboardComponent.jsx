// src/components/DashboardComponent.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardComponent = () => {
  const [gasLevel, setGasLevel] = useState(0);
  const [leakDetected, setLeakDetected] = useState(false);
  const [forecastDate, setForecastDate] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch initial data
    axios.get('/api/cylinder/latest')
      .then(res => {
        setGasLevel(res.data.weight);
        setLeakDetected(res.data.leakStatus);
      });

    axios.get('/api/forecast/latest')
      .then(res => {
        setForecastDate(res.data.predictedEmptyDate);
      });

    axios.get('/api/notifications')
      .then(res => {
        setNotifications(res.data);
      });
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Gas Level Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Current Gas Level</h2>
        <div className="text-4xl font-bold text-blue-600">{gasLevel} kg</div>
      </div>

      {/* Leak Detection */}
      <div className={`p-6 rounded-2xl shadow-lg ${leakDetected ? 'bg-red-100' : 'bg-green-100'}`}>
        <h2 className="text-xl font-semibold mb-2">Gas Leakage Status</h2>
        <div className={`text-2xl font-bold ${leakDetected ? 'text-red-600' : 'text-green-600'}`}>
          {leakDetected ? 'Leak Detected!' : 'No Leak'}
        </div>
      </div>

      {/* Forecast Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold mb-2">Predicted Empty Date</h2>
        <p className="text-lg text-gray-700">{forecastDate}</p>
      </div>

      {/* Notifications */}
      <div className="bg-white shadow-lg rounded-2xl p-6 col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {notifications.length === 0 && <li>No notifications yet.</li>}
          {notifications.map((note, index) => (
            <li key={index}>{note.message} – <span className="text-sm text-gray-500">{note.sentAt}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardComponent;
