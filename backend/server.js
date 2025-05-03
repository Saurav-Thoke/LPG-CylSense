const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios'); // Added axios for making HTTP requests
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin Setup
const serviceAccount = require('./firebase-admin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Models
const Notification = require('./models/Notification'); // Make sure this file exists

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/user', require('./routes/user'));
app.use('/api/cylinders', require('./routes/cylinder'));

// Notification Sender
const sendNotification = (token, title, body) => {
  const message = {
    notification: { title, body },
    token,
  };

  admin.messaging()
    .send(message)
    .then((response) => console.log("✅ Notification sent:", response))
    .catch((error) => console.error("❌ Notification error:", error));
};

// Sample LPG data endpoint
app.get("/data", async (req, res) => {
  try {
    const response = await axios.get(process.env.REACT_APP_DEV_URI); // Replace with actual device IP
    const data = response.data;

    // Check if the gas is "Leak", if so send notification
    if (data.gas === "Leak") {
      const title = "🚨 Gas Leak Detected!";
      const body = "Potential gas leakage detected. Please ensure ventilation and check immediately.";

      // Send notification to the users who have subscribed to alerts
      sendNotificationToUsers(title, body);
    }

    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching device data:", error.message);
    res.status(500).json({ error: "Failed to fetch real-time data" });
  }
});

// Function to send notifications to all users
const sendNotificationToUsers = async (title, body) => {
  try {
    // Fetch all users (or notification tokens) from MongoDB
    const users = await Notification.find();

    users.forEach((user) => {
      // Send the notification to each user
      sendNotification(user.token, title, body);
    });

    console.log("✅ Notifications sent to users");
  } catch (error) {
    console.error("❌ Error fetching users for notifications:", error);
  }
};

// Save token & send notification
app.post("/save-token", async (req, res) => {
  const { token, uid } = req.body; // Accept `uid` along with token

  if (!token || !uid) return res.status(400).json({ success: false, message: "Token and UID are required" });
  const response = await axios.get(process.env.REACT_APP_DEV_URI); // Replace with actual device IP
    const data = response.data;

    // Check if the gas is "Leak", if so send notification
    if (data.gas === "Leak") {
      const title = "🚨 Gas Leak Detected!";
      const body = "Potential gas leakage detected. Please ensure ventilation and check immediately.";

      // Send notification to the users who have subscribed to alerts
     
  try {
    // Save to MongoDB with UID
    const notification = new Notification({ token, uid, title, body });
    await notification.save();

    // Send Firebase Notification
    sendNotification(token, title, body);

    res.status(200).json({ success: true, message: "Notification sent & saved" });
  } catch (error) {
    console.error("❌ Error saving notification:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }}
});

// Get all notifications for a user by UID
app.get("/api/notifications/:uid", async (req, res) => {
  const { uid } = req.params; // Get UID from request params

  try {
    // Fetch notifications for specific UID
    const notifications = await Notification.find({ uid }).sort({ date: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// DELETE: Clear all notifications for a user
app.delete("/api/notifications/:uid/clear", async (req, res) => {
  const { uid } = req.params; // Get UID from request params

  try {
    // Delete all notifications for this user
    await Notification.deleteMany({ uid });

    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("❌ Error clearing notifications:", error);
    res.status(500).json({ message: "Failed to clear notifications" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
