// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// import { signOut, sendPasswordResetEmail, getIdToken } from "firebase/auth";
// import { toast } from "react-toastify";
// import axios from "axios";

// function Profile() {
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [isEditingPhone, setIsEditingPhone] = useState(false);
//   const [isEditingAddress, setIsEditingAddress] = useState(false);

//   // const fetchUserData = async () => {
//   //   try {
//   //     const token = await getIdToken(user);
//   //     const res = await axios.get("http://localhost:5000/api/user", {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });
//   //     const { name, phone, address } = res.data;
//   //     setName(name);
//   //     setPhone(phone);
//   //     setAddress(address);
//   //   } catch (error) {
//   //     toast.error("Failed to fetch user data.");
//   //   }
//   // };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = await getIdToken(user);
//         const res = await axios.get("http://localhost:5000/api/user", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const { name, phone, address } = res.data;
//         setName(name);
//         setPhone(phone);
//         setAddress(address);
//       } catch (error) {
//         toast.error("Failed to fetch user data.");
//       }
//     };
  
//     if (user) fetchUserData();
//   }, [user]);
  

//   const updateUserData = async (data) => {
//     try {
//       const token = await getIdToken(user);
//       await axios.put("http://localhost:5000/api/user", data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } catch (err) {
//       toast.error("Error updating profile.");
//     }
//   };

//   const handleLogout = async () => {
//     const confirmed = window.confirm("Are you sure you want to logout?");
//     if (!confirmed) return;
  
//     try {
//       await signOut(auth);
//       toast.success("Logged out successfully!");
//       navigate("/");
//     } catch (error) {
//       toast.error("Error during logout");
//     }
//   };
  
//   const handlePasswordReset = async () => {
//     if (user?.email) {
//       await sendPasswordResetEmail(auth, user.email);
//       toast.success("Password reset link sent to your email.");
//     } else {
//       toast.error("User not found!");
//     }
//   };

//   const handleNameSave = async () => {
//     setIsEditingName(false);
//     await updateUserData({ name });
//     toast.success("Name updated!");
//   };

//   const handlePhoneSave = async () => {
//     if (phone.length === 10) {
//       setIsEditingPhone(false);
//       await updateUserData({ phone });
//       toast.success("Phone number updated!");
//     } else {
//       toast.error("Please enter a valid 10-digit phone number.");
//     }
//   };

//   const handleAddressSave = async () => {
//     setIsEditingAddress(false);
//     await updateUserData({ address });
//     toast.success("Address updated!");
//   };

//   const PencilIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-4 w-4 text-blue-600 hover:text-blue-800 cursor-pointer"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       strokeWidth={2}
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 16H9v-2.828z"
//       />
//     </svg>
//   );

//   return (
//     <div className="max-w-3xl mx-auto py-10 px-6">
//       <div className="bg-white shadow-xl rounded-xl p-6 space-y-6">
//         {/* Profile Header */}
//         <div className="space-y-4">
//           {/* Name */}
//           <div className="flex items-center space-x-2">
//             {isEditingName ? (
//               <>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleNameSave();
//                   }}
//                   placeholder="User Name"
//                   className="border px-2 py-1 rounded w-full"
//                 />
//                 <button onClick={handleNameSave} className="text-sm text-blue-600">
//                   Save
//                 </button>
//               </>
//             ) : (
//               <>
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   {name || "User Name"}
//                 </h2>
//                 <span onClick={() => setIsEditingName(true)}>
//                   <PencilIcon />
//                 </span>
//               </>
//             )}
//           </div>

//           {/* Email */}
//           <p className="text-gray-600">{user?.email}</p>

//           {/* Phone */}
//           <div className="flex items-center space-x-2 mt-1">
//             {isEditingPhone ? (
//               <>
//                 <input
//                   type="text"
//                   value={phone}
//                   onChange={(e) => {
//                     const numeric = e.target.value.replace(/\D/g, "");
//                     if (numeric.length <= 10) setPhone(numeric);
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handlePhoneSave();
//                   }}
//                   maxLength={10}
//                   className="border px-2 py-1 rounded w-full"
//                   placeholder="Enter phone number"
//                 />
//                 <button onClick={handlePhoneSave} className="text-sm text-blue-600">
//                   Save
//                 </button>
//               </>
//             ) : (
//               <>
//                 <p className="text-gray-600">
//                   {phone ? `📞 ${phone}` : "📞 Add phone number"}
//                 </p>
//                 <span onClick={() => setIsEditingPhone(true)}>
//                   <PencilIcon />
//                 </span>
//               </>
//             )}
//           </div>

//           {/* Address Section */}
//           <div className="flex items-start justify-between">
//             <div className="w-full">
//               <div className="flex items-center space-x-2 mb-1">
//                 <h3 className="text-lg font-semibold text-gray-700">Address</h3>
//                 {!isEditingAddress && (
//                   <span onClick={() => setIsEditingAddress(true)}>
//                     <PencilIcon />
//                   </span>
//                 )}
//               </div>
//               {isEditingAddress ? (
//                 <div className="flex items-start space-x-2">
//                   <textarea
//                     rows="3"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" && !e.shiftKey) {
//                         e.preventDefault();
//                         handleAddressSave();
//                       }
//                     }}
//                     className="w-full border px-3 py-2 rounded"
//                     placeholder="Enter your full address..."
//                   />
//                   <button
//                     onClick={handleAddressSave}
//                     className="text-sm text-blue-600 mt-1"
//                   >
//                     Save
//                   </button>
//                 </div>
//               ) : (
//                 <p className="text-gray-600 whitespace-pre-wrap">
//                   {address || "No address saved yet."}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-between gap-4 pt-6">
//           <button
//             onClick={handlePasswordReset}
//             className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500 w-full"
//           >
//             Reset Password
//           </button>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, sendPasswordResetEmail, getIdToken } from "firebase/auth";
import { toast } from "react-toastify";
import axios from "axios";

function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getIdToken(user);
        const res = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, phone, address } = res.data;
        setName(name);
        setPhone(phone);
        setAddress(address);
      } catch (error) {
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchUserData();
  }, [user]);

  const updateUserData = async (data) => {
    try {
      const token = await getIdToken(user);
      await axios.put("http://localhost:5000/api/user", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      toast.error("Error updating profile.");
    }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Error during logout");
    }
  };

  const handlePasswordReset = async () => {
    if (user?.email) {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset link sent to your email.");
    } else {
      toast.error("User not found!");
    }
  };

  const handleNameSave = async () => {
    setIsEditingName(false);
    await updateUserData({ name });
    toast.success("Name updated!");
  };

  const handlePhoneSave = async () => {
    if (phone.length === 10) {
      setIsEditingPhone(false);
      await updateUserData({ phone });
      toast.success("Phone number updated!");
    } else {
      toast.error("Please enter a valid 10-digit phone number.");
    }
  };

  const handleAddressSave = async () => {
    setIsEditingAddress(false);
    await updateUserData({ address });
    toast.success("Address updated!");
  };

  const PencilIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-blue-600 hover:text-blue-800 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 16H9v-2.828z"
      />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="bg-white shadow-xl rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center space-x-2">
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNameSave();
                  }}
                  placeholder="User Name"
                  className="border px-2 py-1 rounded w-full"
                />
                <button onClick={handleNameSave} className="text-sm text-blue-600">
                  Save
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800">
                  {name || "User Name"}
                </h2>
                <span onClick={() => setIsEditingName(true)}>
                  <PencilIcon />
                </span>
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
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/\D/g, "");
                    if (numeric.length <= 10) setPhone(numeric);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePhoneSave();
                  }}
                  maxLength={10}
                  className="border px-2 py-1 rounded w-full"
                  placeholder="Enter phone number"
                />
                <button onClick={handlePhoneSave} className="text-sm text-blue-600">
                  Save
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600">
                  {phone ? `📞 ${phone}` : "📞 Add phone number"}
                </p>
                <span onClick={() => setIsEditingPhone(true)}>
                  <PencilIcon />
                </span>
              </>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start justify-between">
            <div className="w-full">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-700">Address</h3>
                {!isEditingAddress && (
                  <span onClick={() => setIsEditingAddress(true)}>
                    <PencilIcon />
                  </span>
                )}
              </div>
              {isEditingAddress ? (
                <div className="flex items-start space-x-2">
                  <textarea
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddressSave();
                      }
                    }}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter your full address..."
                  />
                  <button
                    onClick={handleAddressSave}
                    className="text-sm text-blue-600 mt-1"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-gray-600 whitespace-pre-wrap">
                  {address || "No address saved yet."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 pt-6">
          <button
            onClick={handlePasswordReset}
            className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500 w-full"
          >
            Reset Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
