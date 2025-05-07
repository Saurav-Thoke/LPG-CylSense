
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { getAuth } from "firebase/auth";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;

        const uid = user.uid;
        const res = await axios.get(`http://localhost:5000/api/notifications/${uid}`);

        const formatted = res.data
          .map((note, index) => ({
            id: index,
            message: note.title + " - " + note.body,
            type: "info",
            timestamp: note.timestamp,
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setNotifications(formatted);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleClearAll = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) return;

      const uid = user.uid;
      await axios.delete(`${process.env.REACT_APP_DOMAIN_URI}/api/notifications/${uid}/clear`);
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  };

  // 🔄 Show Fullscreen Spinner While Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">📢 Your Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-800 text-2xl"
            title="Clear All Notifications"
          >
            🗑️
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No notifications yet 🚫</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((note) => {
            const dateObj = new Date(note.timestamp);
            const isValid = note.timestamp && !isNaN(dateObj);

            return (
              <div
                key={note.id}
                className={`p-5 rounded-lg border shadow-md transition duration-300 hover:scale-[1.01] ${getColor(note.type)}`}
              >
                <p className="font-semibold">{note.message}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {isValid
                    ? formatDistanceToNow(dateObj, { addSuffix: true })
                    : "Unknown time"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notification;

