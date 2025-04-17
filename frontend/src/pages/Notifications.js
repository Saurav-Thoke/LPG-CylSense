import React, { useEffect, useState } from "react";
import axios from "axios";

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications");
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <ul>
        {notifications.map((note, index) => (
          <li key={index} className="bg-yellow-100 p-3 mb-2 rounded">
            {note.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notification;
