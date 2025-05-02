import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

const LeakStatusCard = ({ isLeaking }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300
        ${isLeaking ? "bg-red-100" : "bg-green-100"}`}
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Leak Status</h3>

      {isLeaking ? (
        <div className="flex items-center space-x-3 text-red-700">
          <AlertTriangle size={28} />
          <span className="text-lg font-semibold">Leak Detected!</span>
        </div>
      ) : (
        <div className="flex items-center space-x-3 text-green-700">
          <CheckCircle size={28} />
          <span className="text-lg font-semibold">No Leak Detected</span>
        </div>
      )}
    </div>
  );
};

export default LeakStatusCard;


