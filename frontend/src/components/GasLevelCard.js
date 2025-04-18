import React from "react";

const GasLevelCard = ({ weight, capacity }) => {
  const percentFilled = ((weight / capacity) * 100).toFixed(0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Gas Level</h3>
      <p className="text-2xl font-bold text-blue-600 mb-1">{weight} kg</p>
      <p className="text-sm text-gray-500">of {capacity} kg</p>

      <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
        <div
          className="bg-blue-500 h-3 rounded-full"
          style={{ width: `${percentFilled}%` }}
        />
      </div>
      <p className="text-right text-xs text-gray-400 mt-1">
        {percentFilled}% Full
      </p>
    </div>
  );
};

export default GasLevelCard;
