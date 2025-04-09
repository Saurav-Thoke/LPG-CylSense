import Navbar from "../components/Navbar";
export default function Forecast() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold">Forecast Data</h2>
        <p className="mt-2">Detailed usage predictions and insights will be displayed here.</p>
      </div>
    </div>
  );
}