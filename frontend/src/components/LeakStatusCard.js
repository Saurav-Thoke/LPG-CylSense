export default function LeakStatusCard({ isLeaking }) {
    return (
      <div className={`bg-white rounded-2xl shadow p-6 w-full md:w-1/3 ${isLeaking ? 'border-red-500 border-2' : ''}`}>
        <h2 className="text-xl font-semibold text-gray-800">Gas Leak Status</h2>
        <div className={`text-2xl font-bold mt-2 ${isLeaking ? 'text-red-600' : 'text-green-600'}`}>
          {isLeaking ? 'Leak Detected!' : 'Safe'}
        </div>
      </div>
    );
  }