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
      {/* <Navbar /> */}
      <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={user ? <UserDashboard /> : <Navigate to="/login" />}
          />
          {/* Optional: 404 route */}
          {/* <Route path="*" element={<NotFound />} /> */}
          <Route path="/forecast" element={<Forecast />} />
<Route path="/notification" element={<Notifications />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
