import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Firebase Auth
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import { messaging } from './firebase';
import { getToken, onMessage } from "firebase/messaging";


const VAPID_KEY = "BGymQrL8E7nBxDmmPIHLBffACvlxcF6idbc_2LUrCP7O9prm4z1ha2YxFvEr7Ky32LcA7-SGi8iFTCWSrv90I68"; // From Firebase Console

async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("FCM Token:", token);
    await sendTokenToBackend(token).catch(()=>{
      console.log("Error in sending data");
      
    });
    // Send this token to your backend to save it
  } else {
    alert("Notification permission denied.");
  }
}

// onMessage(messaging, (payload) => {
//   console.log("Foreground push received:", payload);
//   // show custom UI if needed
// });

onMessage(messaging, (payload) => {
  console.log("Foreground Message:", payload);
  alert(`${payload.notification.title}\n${payload.notification.body}`);
});



async function sendTokenToBackend(token) {
  const response = await fetch('http://localhost:5000/save-token', {  // Update your API URL here
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }), // Send token as part of the request body
  });
  
  const data = await response.json();
  console.log('Backend response:', data);
}
requestPermission();


function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Conditionally render Navbar if user is authenticated */}
        {user && <Navbar />}

        <ToastContainer />
        
        <Routes>
          {/* Route for profile page */}
          <Route path="/profile" element={<Profile />} />

          {/* Default route will redirect to dashboard if user is logged in */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />

          {/* Login route */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

          {/* Register route */}
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          
          {/* Protected route: User Dashboard */}
          <Route
            path="/dashboard"
            element={user ? <UserDashboard /> : <Navigate to="/" />}
          />

          {/* Forecast Route */}
          <Route path="/forecast" element={<Forecast />} />
          
          {/* Notifications Route */}
          <Route path="/notification" element={<Notifications />} />

          {/* Optional: 404 Route */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
