import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/"); // Redirecting to AuthPage
    } catch (error) {
      toast.error("Error during logout");
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold text-blue-600">
        LPG CylSense
      </Link>

      <div className="space-x-4">
        
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
          Dashboard
        </Link>
        <Link to="/forecast" className="text-gray-700 hover:text-blue-600">
          Forecast
        </Link>
        <Link to="/notification" className="text-gray-700 hover:text-blue-600">
          Notification
        </Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600">
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
