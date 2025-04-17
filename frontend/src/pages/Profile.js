import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || "User Name");
  const [phone, setPhone] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [address, setAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addressList, setAddressList] = useState([]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handlePasswordReset = async () => {
    if (user?.email) {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset link sent to your email.");
    } else {
      toast.error("User not found!");
    }
  };

  const handleSaveAddress = () => {
    if (address.trim()) {
      setAddressList([...addressList, address]);
      setAddress("");
      setShowModal(false);
      toast.success("Address saved!");
    }
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    toast.success("Name updated!");
  };

  const handlePhoneSave = () => {
    setIsEditingPhone(false);
    toast.success("Phone number updated!");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="bg-white shadow-xl rounded-xl p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/100"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>
          <div className="w-full">
            {/* Name */}
            <div className="flex items-center space-x-2">
              {isEditingName ? (
                <>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <button
                    onClick={handleNameSave}
                    className="text-sm text-blue-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
            {/* Email */}
            <p className="text-gray-600">{user?.email}</p>
            {/* Phone */}
            <div className="flex items-center space-x-2 mt-1">
              {isEditingPhone ? (
                <>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="Enter phone number"
                  />
                  <button
                    onClick={handlePhoneSave}
                    className="text-sm text-blue-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600">
                    {phone ? `📞 ${phone}` : "📞 Add phone number"}
                  </p>
                  <button
                    onClick={() => setIsEditingPhone(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handlePasswordReset}
            className="bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500"
          >
            Reset Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Address Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Saved Addresses
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700"
            >
              + Add Address
            </button>
          </div>
          {addressList.length > 0 ? (
            <ul className="space-y-2">
              {addressList.map((addr, index) => (
                <li
                  key={index}
                  className="border p-2 rounded-md text-gray-700 bg-gray-50"
                >
                  {addr}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 italic">No addresses saved yet.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Address
            </h3>
            <textarea
              rows="4"
              className="w-full border px-3 py-2 rounded focus:outline-none"
              placeholder="Enter your full address here..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
