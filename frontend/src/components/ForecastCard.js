export default function ForecastCard({ predictedDate }) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 w-full md:w-1/3">
        <h2 className="text-xl font-semibold text-gray-800">Forecast</h2>
        <div className="text-lg text-gray-700 mt-2">
          Gas expected to run out by: <span className="font-bold text-blue-600">{predictedDate}</span>
        </div>
      </div>
    );
  }