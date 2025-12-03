import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const plantOptions = [
"MS", "MN", "SB", "LTN1", "LTN4", "LTN3A", "LTN3B", "LTN3C", "LTN3D", "MH1", "MH2"
];

const Dashboard = () => {
  const [plant, setPlant] = useState("LTN3B");
  const [stats, setStats] = useState(null);
  const [riskZones, setRiskZones] = useState({ Critical: 0, Warning: 0, Safe: 0 });
  const [topCriticalEquip, setTopCriticalEquip] = useState([]);
  const [ageDistribution, setAgeDistribution] = useState({});

  useEffect(() => {
    if (plant) {
      axios
        .get(`http://svtn3local01:9095/api/dashboard/stats?plant=${plant}`)
        .then((res) => setStats(res.data))
        .catch((err) => console.error("Failed to fetch stats:", err));

      axios
        .get(`http://svtn3local01:9095/api/dashboard/riskZones?plant=${plant}`)
        .then((res) => setRiskZones(res.data))
        .catch((err) => console.error("Failed to fetch risk zones:", err));

      axios
        .get(`http://svtn3local01:9095/api/dashboard/topCriticalEquipment?plant=${plant}`)
        .then((res) => setTopCriticalEquip(res.data))
        .catch((err) => console.error("Failed to fetch top critical equipment:", err));

      axios
        .get(`http://svtn3local01:9095/api/dashboard/equipmentAgeDistribution?plant=${plant}`)
        .then((res) => setAgeDistribution(res.data))
        .catch((err) => console.error("Failed to fetch age distribution:", err));
    }
  }, [plant]);

  const renderBarChart = (location) => {
    if (!stats || !stats.equipmentCounts[location]) return null;

    const data = stats.equipmentCounts[location];
    const labels = Object.keys(data);
    const values = Object.values(data);

    return (
      <div className="bg-gradient-to-br  from-white to-gray-50 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-[1.03] h-[350px] flex flex-col">
        <h3 className="text-xl font-semibold mb-5 text-gray-800 border-b border-gray-200 pb-2">
          Equipment Count - {location}
        </h3>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: location,
                data: values,
                backgroundColor: "rgba(37, 99, 235, 0.7)", // Tailwind blue-600
                borderRadius: 6,
                barPercentage: 0.6,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#4B5563" }, // gray-600
                grid: { color: "#E5E7EB" }, // gray-200
              },
              x: {
                ticks: { color: "#4B5563" },
                grid: { display: false },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
          }}
        />
      </div>
    );
  };

  const renderRiskZonesChart = () => {
    const labels = ["Critical", "Warning", "Safe"];
    const dataValues = labels.map((label) => riskZones[label] || 0);
    const colors = ["#dc2626", "#f97316", "#16a34a"]; // Tailwind red-600, orange-400, green-600

    return (
      <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-[1.03] h-[350px] flex flex-col">
        <h3 className="text-xl font-semibold mb-5 text-gray-800 border-b border-gray-200 pb-2">
          Predictive Maintenance Risk Zones
        </h3>
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                data: dataValues,
                backgroundColor: colors,
                borderWidth: 1,
                borderColor: "#F9FAFB", // gray-50
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom", labels: { font: { size: 14 }, color: "#374151" } }, // gray-700
              tooltip: { enabled: true },
            },
          }}
        />
      </div>
    );
  };

  const renderTopCriticalEquipment = () => {
    if (!topCriticalEquip.length)
      return <p className="text-gray-500 italic">No critical equipment found.</p>;

    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-5 text-gray-800 border-b border-gray-200 pb-2">
          Top 5 Critical Equipment
        </h3>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm tracking-wide">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-right">Age (yrs)</th>
              <th className="px-6 py-3 text-right">RUL (yrs)</th>
            </tr>
          </thead>
          <tbody>
            {topCriticalEquip.map((eq) => (
              <tr
                key={eq.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">{eq.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{eq.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-indigo-600">
                  {eq.age}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-red-600">
                  {eq.rul}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAgeDistributionChart = () => {
    const labels = ["0-3 yrs", "4-7 yrs", "8+ yrs"];
    const dataValues = labels.map((label) => ageDistribution[label] || 0);
    const colors = ["#2563EB", "#60A5FA", "#93C5FD"]; // Tailwind blue shades

    return (
      <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl shadow-lg h-[350px] flex flex-col">
        <h3 className="text-xl font-semibold mb-5 text-gray-800 border-b border-gray-200 pb-2">
          Equipment Age Distribution
        </h3>
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                data: dataValues,
                backgroundColor: colors,
                borderWidth: 1,
                borderColor: "#F3F4F6", // gray-100
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom", labels: { font: { size: 14 }, color: "#374151" } },
              tooltip: { enabled: true },
            },
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen  mt-16 bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 border-b border-gray-300 pb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 md:mb-0">
           Dashboard
        </h1>

        <div className="flex items-center space-x-3">
          <label
            htmlFor="plant"
            className="text-lg font-semibold text-gray-700 select-none"
          >
            Select Plant:
          </label>
          <select
            id="plant"
            value={plant}
            onChange={(e) => setPlant(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {plantOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </header>

      {stats && (
        <>
          {/* Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                title: "Cutting Avg Age",
                value: stats.avgAges["CuttingWirePreparation"].toFixed(1),
                color: "text-blue-600",
              },
              {
                title: "Assembly Avg Age",
                value: stats.avgAges["Assembly"].toFixed(1),
                color: "text-purple-600",
              },
              {
                title: "Testing Avg Age",
                value: stats.avgAges["PostAssemblyTesting"].toFixed(1),
                color: "text-teal-600",
              },
              {
                title: "Avg Remaining Useful Life",
                value: stats.avgRul.toFixed(1),
                color: "text-green-600",
              },
            ].map(({ title, value, color }) => (
              <div
                key={title}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition transform hover:scale-[1.03]"
              >
                <h4 className="text-sm text-gray-500 mb-1 tracking-wide">{title}</h4>
                <p className={`text-3xl font-extrabold ${color}`}>{value} yrs</p>
              </div>
            ))}
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          {renderBarChart("CuttingWirePreparation")}
          {renderBarChart("Assembly")}
          {renderBarChart("PostAssemblyTesting")}

            {renderRiskZonesChart()}
          </section>

          {/* Additional Features */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {renderTopCriticalEquipment()}
            {renderAgeDistributionChart()}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
