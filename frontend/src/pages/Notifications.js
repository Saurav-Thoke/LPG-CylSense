import Navbar from "../components/Navbar";
export default function Notifications() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <p className="mt-2">Recent alerts will be listed here.</p>
      </div>
    </div>
  );
}