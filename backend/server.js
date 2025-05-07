

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",  // Replace with your frontend URL
  methods: "GET,POST",              // Allow specific methods (GET, POST, etc.)
  allowedHeaders: "Content-Type",   // Allow certain headers
};
// Firebase Admin Setup
const serviceAccount = require('./firebase-admin.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Models
const Notification = require('./models/Notification');
const SensorData = require('./models/SensorData'); // 💡 You'll create this model

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/user', require('./routes/user'));
app.use('/api/cylinders', require('./routes/cylinder'));

// 🔔 Send Firebase Notification
const sendNotification = (token, title, body) => {
  const message = { notification: { title, body }, token };
  admin.messaging()
    .send(message)
    .then((response) => console.log("✅ Notification sent:", response))
    .catch((error) => console.error("❌ Notification error:", error));
};

// Sample LPG data endpoint
app.get("/data", async (req, res) => {
  try {
    const response = await axios.get(process.env.REACT_APP_DEV_URI);
    const data = response.data;

    if (data.gas_detected === true) {
      sendNotificationToUsers(
        "🚨 Gas Leak Detected!",
        "Potential gas leakage detected. Please ensure ventilation and check immediately.",
        "leak"
      );
    }

    if (data.weight <= 1) {
      sendNotificationToUsers(
        "Low Gas Alert!",
        `Gas level is at ${data.weight}%. Please refill soon.`,
        "low"
      );
    }

    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching device data:", error.message);
    res.status(500).json({ error: "Failed to fetch real-time data" });
  }
});


// Function to send notifications to all users
// Function to send notifications to all users with cooldown
const sendNotificationToUsers = async (title, body, type) => {
  try {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60000);

    const recent = await Notification.find({
      type,
      timestamp: { $gte: thirtyMinutesAgo }
    });

    if (recent.length > 0) {
      console.log(`⏱ Skipping '${type}' notification due to cooldown.`);
      return;
    }

    const uids = await Notification.distinct("uid");
    if (uids.length === 0) {
      console.log("❌ No user UIDs found to send notifications.");
      return;
    }

    for (const uid of uids) {
      const latest = await Notification.findOne({ uid }).sort({ timestamp: -1 });
      if (!latest || !latest.token) {
        console.warn(`⚠️ No valid token for UID: ${uid}`);
        continue;
      }

      sendNotification(latest.token, title, body);

      const newNotification = new Notification({
        uid,
        token: latest.token,
        title,
        body,
        type,
      });

      await newNotification.save();
    }

    console.log(`✅ '${type}' Notifications sent to all users`);
  } catch (error) {
    console.error("❌ Error sending notifications with cooldown:", error);
  }
};



// 🔥 Endpoint for ESP to POST data
app.post('/api/sensor-data', async (req, res) => {
  const { weight, gas, device } = req.body;
  console.log("Received Data:", req.body);  // Log the incoming data

  if (!weight || !gas || !device) {
    return res.status(400).json({ success: false, message: "Missing data fields" });
  }

  try {
    const newData = new SensorData({ weight, gas, device });
    await newData.save();
    res.status(200).json({ success: true, message: "Sensor data received and stored" });
  } catch (error) {
    console.error("❌ Error saving sensor data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// 📥 GET sensor data (for frontend)



// 🔑 Save token and send notification on gas leak
app.post("/save-token", async (req, res) => {
  const { token, uid } = req.body;

  if (!token || !uid) return res.status(400).json({ success: false, message: "Token and UID are required" });

  try {
    // Fetch the device data (gas data)
    const response = await axios.get(process.env.REACT_APP_DEV_URI); // Replace with actual device IP
    const data = response.data;

    // Check if the gas is "Leak", if so send notification
    if (data.gas === true) {
      const title = "🚨 Gas Leak Detected!";
      const body = "Potential gas leakage detected. Please ensure ventilation and check immediately.";

      // Save to MongoDB with UID
      const notification = new Notification({ token, uid, title, body });
      await notification.save();

      // Send Firebase Notification
      sendNotification(token, title, body);

      res.status(200).json({ success: true, message: "Notification sent & saved" });
    }
  } catch (error) {
    console.error("❌ Error fetching data or saving token:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }}
);


// 🔔 Notification history routes
app.get("/api/notifications/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const notifications = await Notification.find({ uid }).sort({ date: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

app.delete("/api/notifications/:uid/clear", async (req, res) => {
  const { uid } = req.params;

  try {
    await Notification.deleteMany({ uid });
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("❌ Error clearing notifications:", error);
    res.status(500).json({ message: "Failed to clear notifications" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
