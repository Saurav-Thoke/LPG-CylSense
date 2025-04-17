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

// Components
import Navbar from "./components/Navbar";

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
