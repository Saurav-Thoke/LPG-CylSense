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

// 🔁 Function to send to all users
const sendNotificationToUsers = async (title, body) => {
  try {
    const users = await Notification.find();
    users.forEach(user => sendNotification(user.token, title, body));
    console.log("✅ Notifications sent to all users");
  } catch (error) {
    console.error("❌ Error sending to users:", error);
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

  if (!token || !uid)
    return res.status(400).json({ success: false, message: "Token and UID are required" });

  try {
    const notification = new Notification({
      token,
      uid,
      title: "🚨 Gas Leak Detected!",
      body: "Potential gas leakage detected. Please ensure ventilation and check immediately.",
    });

    await notification.save();
    sendNotification(token, notification.title, notification.body);

    res.status(200).json({ success: true, message: "Notification sent & saved" });
  } catch (error) {
    console.error("❌ Error saving notification:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get('/api/sensor-data', async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error fetching sensor data:", error.message);
    res.status(500).json({ message: "Failed to fetch sensor data" });
  }
});


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
