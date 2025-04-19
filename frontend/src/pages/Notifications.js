import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Dummy data (replace with backend API call later)
    const dummyNotifications = [
      {
        id: 1,
        message: "⛽ Gas level dropped below 20%",
        type: "warning",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        id: 2,
        message: "✅ Refill request confirmed",
        type: "success",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      },
      {
        id: 3,
        message: "📦 Cylinder will be delivered tomorrow",
        type: "info",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
    ];

    setNotifications(dummyNotifications);
  }, []);

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Notifications</h2>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg shadow-md ${getColor(note.type)}`}
            >
              <p className="font-medium">{note.message}</p>
              <p className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(note.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
