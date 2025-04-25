import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { onAuthStateChanged } from "firebase/auth";
import { getToken, onMessage } from "firebase/messaging";
import { auth, messaging } from "./firebase";

// Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";

const VAPID_KEY = "BGymQrL8E7nBxDmmPIHLBffACvlxcF6idbc_2LUrCP7O9prm4z1ha2YxFvEr7Ky32LcA7-SGi8iFTCWSrv90I68";

// Send FCM token & UID to backend
async function sendTokenToBackend(token) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.error("❌ No authenticated user found.");
    return;
  }

  const uid = currentUser.uid;

  try {
    const response = await fetch('http://localhost:5000/save-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, uid }),
    });

    const data = await response.json();
    console.log('📡 Backend response:', data);
  } catch (err) {
    console.error("❌ Error sending token to backend:", err);
  }
}

// Ask for notification permission and get FCM token
async function requestPermissionAndSendToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      console.log("✅ FCM Token:", token);
      await sendTokenToBackend(token);
    } else {
      alert("🚫 Notification permission denied.");
    }
  } catch (error) {
    console.error("❌ Error requesting permission:", error);
  }
}

// Handle foreground FCM messages
onMessage(messaging, (payload) => {
  console.log("📬 Foreground Message:", payload);
  alert(`${payload.notification.title}\n${payload.notification.body}`);
});

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        await requestPermissionAndSendToken();
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user && <Navbar />}
        <ToastContainer />
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <UserDashboard /> : <Navigate to="/" />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/notification" element={<Notifications />} />
          {/* Optional: 404 Route */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
