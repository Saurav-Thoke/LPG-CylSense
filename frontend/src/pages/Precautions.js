import { useState } from "react";
import { AlertTriangle, PhoneCall, ShieldOff, DoorOpen, ZapOff, LogOut, Bell } from "lucide-react";

const preventiveMeasures = [
  {
    title: "Turn off Gas Supply",
    detail: "Immediately close the main gas valve to stop leakage.",
    icon: <ShieldOff className="text-red-500" />
  },
  {
    title: "Open Windows and Doors",
    detail: "Ventilate the area by opening all doors and windows.",
    icon: <DoorOpen className="text-yellow-500" />
  },
  {
    title: "Avoid Using Electrical Devices",
    detail: "Don't switch ON/OFF any electrical devices; it may ignite gas.",
    icon: <ZapOff className="text-orange-500" />
  },
  {
    title: "Evacuate the Area",
    detail: "Leave the building and move to a safe location.",
    icon: <LogOut className="text-pink-500" />
  },
  {
    title: "Call Emergency Services",
    detail: "Call your local fire department or gas company immediately.",
    icon: <Bell className="text-purple-500" />
  }
];

export default function Precautions() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (index) => {
    setSelected(index === selected ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <AlertTriangle size={32} className="text-red-600" />
        <h1 className="text-3xl font-bold text-red-700">
          Gas Leak - Preventive Measures
        </h1>
      </div>

      {/* Helpline Banner */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-md flex justify-between items-center">
        <div>
          <p className="font-semibold text-yellow-700">
            🚨 Emergency Helpline
          </p>
          <p className="text-lg text-gray-800">
            Call <span className="font-bold text-black">1906</span> immediately in case of a gas leak.
          </p>
        </div>
        <a
          href="tel:1906"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
        >
          <PhoneCall size={18} /> Call Now
        </a>
      </div>

      {/* Measures */}
      <div className="space-y-4">
        {preventiveMeasures.map((measure, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 transition-all duration-300 shadow ${
              selected === index ? "bg-red-50 border-red-300" : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {measure.icon}
                <h2 className="text-lg font-semibold">{measure.title}</h2>
              </div>
              <button
                onClick={() => handleSelect(index)}
                className="text-sm border px-3 py-1 rounded hover:bg-gray-100 transition"
              >
                {selected === index ? "Hide" : "Details"}
              </button>
            </div>
            {selected === index && (
              <p className="mt-3 text-gray-700">{measure.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
