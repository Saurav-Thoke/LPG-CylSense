export default function GasLevelCard({ weight, capacity }) {
    const percentage = ((weight / capacity) * 100).toFixed(1);
    return (
      <div className="bg-white rounded-2xl shadow p-6 w-full md:w-1/3">
        <h2 className="text-xl font-semibold text-gray-800">Gas Level</h2>
        <div className="text-3xl font-bold text-green-600 mt-2">{percentage}%</div>
        <p className="text-gray-500 mt-1">Current Weight: {weight}kg</p>
      </div>
    );
  }