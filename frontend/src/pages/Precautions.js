import { useState } from "react";
import { AlertTriangle } from "lucide-react";

const preventiveMeasures = [
  {
    title: "Turn off Gas Supply",
    detail: "Immediately close the main gas valve to stop leakage."
  },
  {
    title: "Open Windows and Doors",
    detail: "Ventilate the area by opening all doors and windows."
  },
  {
    title: "Avoid Using Electrical Devices",
    detail: "Don't switch ON/OFF any electrical devices; it may ignite gas."
  },
  {
    title: "Evacuate the Area",
    detail: "Leave the building and move to a safe location."
  },
  {
    title: "Call Emergency Services",
    detail: "Call your local fire department or gas company immediately."
  }
];

export default function Precautions() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (index) => {
    setSelected(index === selected ? null : index);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <AlertTriangle color="red" size={32} style={{ marginRight: "10px" }} />
        <h1 style={{ fontSize: "28px", color: "red", fontWeight: "bold" }}>
          Gas Leak - Preventive Measures
        </h1>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {preventiveMeasures.map((measure, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: selected === index ? "#ffe5e5" : "#ffffff",
              transition: "background-color 0.3s ease"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>{measure.title}</h2>
              <button
                onClick={() => handleSelect(index)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  backgroundColor: "#f9f9f9",
                  cursor: "pointer"
                }}
              >
                {selected === index ? "Hide" : "Details"}
              </button>
            </div>
            {selected === index && (
              <p style={{ marginTop: "10px", color: "#555" }}>{measure.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

