// import React from "react";
// import { CalendarDays } from "lucide-react";

// const ForecastCard = ({ predictedDate }) => {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
//       <h3 className="text-lg font-semibold text-gray-700 mb-4">Forecast</h3>
//       {/* <div className="relative w-32 h-32 mb-4"></div> */}
//         <div className="flex items-center space-x-3">
//           <CalendarDays size={28} className="text-blue-500" />
//           <div>
//             <p className="text-sm text-gray-500">Estimated Empty Date:</p>
//             <p className="text-lg font-semibold text-blue-600">{predictedDate}</p>
//           </div>
//         </div>
//       <div/>
//     </div>
//   );
// };

// export default ForecastCard;


import React, { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import axios from "axios";
import { getAuth } from "firebase/auth";

const ForecastCard = () => {
  const [predictedDate, setPredictedDate] = useState(null);

  useEffect(() => {
    const fetchPredictedDate = async () => {
      try {
        const user = getAuth().currentUser;
        if (!user) return;

        const uid = user.uid;
        const res = await axios.get(`http://localhost:5000/api/cylinders/${uid}`);

        const data = res.data;
        const prediction = data?.predictedEmptyDate;
        if (prediction) setPredictedDate(prediction);
      } catch (error) {
        console.error("Error fetching predicted date:", error);
      }
    };

    fetchPredictedDate();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Forecast</h3>
      <div className="flex items-center space-x-3">
        <CalendarDays size={28} className="text-blue-500" />
        <div>
          <p className="text-sm text-gray-500">Estimated Empty Date:</p>
          <p className="text-lg font-semibold text-blue-600">
            {predictedDate ? predictedDate : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
