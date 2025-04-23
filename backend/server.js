const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const admin = require('firebase-admin');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/user', require('./routes/user'));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const sendNotification = (token, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  admin.messaging()
    .send(message)
    .then((response) => {
      console.log("✅ Successfully sent message:", response);
    })
    .catch((error) => {
      console.error("❌ Error sending message:", error);
    });
};

app.post("/save-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  console.log("Received token from frontend:---------------------", token);

  // ✅ You can now save this token to DB, Firebase, etc.
  // For now, just send a response back
  res.status(200).json({ success: true, message: token });
  
    sendNotification(
      token,  // Push Notification Token
      "🚨 Gas Leak Detected!",  // Notification Title
      "Potential gas leakage detected. Please ensure ventilation and check immediately."  // Notification Body
    );



});


// const express = require('express');
// const cors = require('cors');
// const admin = require('firebase-admin');
// require('dotenv').config();

// // Initialize express app
// const app = express();
// app.use(cors());
// app.use(express.json());

// // Firebase Admin Setup
// const serviceAccount = require('./firebase-admin.json'); // Replace with actual path

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // Helper Function to Send Push Notification
// const sendNotification = (token, title, body) => {
//   const message = {
//     notification: {
//       title,
//       body,
//     },
//     token,
//   };

//   admin.messaging()
//     .send(message)
//     .then((response) => {
//       console.log("✅ Successfully sent message:", response);
//     })
//     .catch((error) => {
//       console.error("❌ Error sending message:", error);
//     });
// };

// // Simulated Route for Gas Leak Detection (Backend)
// app.post('/sensor-update', (req, res) => {
//   // const { isLeaking, token } = req.body;  // Assuming the front-end sends `isLeaking` and `token`
//   const isLeaking=true;
//   const { token } = req.body; 

//   if (!token || isLeaking === undefined) {
//     return res.status(400).json({ message: "Missing token or isLeaking status" });
//   }

  // if (true) {
  //   sendNotification(
  //     token,  // Push Notification Token
  //     "🚨 Gas Leak Detected!",  // Notification Title
  //     "Potential gas leakage detected. Please ensure ventilation and check immediately."  // Notification Body
  //   );
  // }

//   res.status(200).json({ message: "Sensor data processed" });
// });

// // Starting the Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
