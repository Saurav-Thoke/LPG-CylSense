import React, { useEffect, useState } from "react";
import axios from "axios";

function Forecast() {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/forecast");
        setForecast(res.data);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      }
    };

    fetchForecast();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Gas Demand Forecast</h1>
      <ul>
        {forecast.map((item, index) => (
          <li key={index} className="bg-gray-100 p-2 mb-2 rounded">
            {item.date}: {item.prediction} kg
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Forecast;
