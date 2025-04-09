import Navbar from "../components/Navbar.js";
import GasLevelCard from "../components/GasLevelCard";
import LeakStatusCard from "../components/LeakStatusCard";
import ForecastCard from "../components/ForecastCard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 grid gap-6 md:grid-cols-3">
        <GasLevelCard weight={12.5} capacity={14.2} />
        <LeakStatusCard isLeaking={false} />
        <ForecastCard predictedDate="April 15, 2025" />
      </div>
    </div>
  );
}