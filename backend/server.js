const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
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

// Save token & send notification
app.post("/save-token", async (req, res) => {
  const { token, uid } = req.body; // Accept `uid` along with token

  if (!token || !uid) return res.status(400).json({ success: false, message: "Token and UID are required" });

  const title = "🚨 Gas Leak Detected!";
  const body = "Potential gas leakage detected. Please ensure ventilation and check immediately.";

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
  }
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

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
