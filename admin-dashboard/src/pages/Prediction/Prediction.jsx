import React, { useState } from "react";
import axios from "axios";

const initialFormState = {
  plant: "",
  process: "",
  master_data_name: "",
  location: "",
  year: "",
  equipment_commercialized: false,
  pdr_commercialized: false,
  production_hours: "",
  replacement_parts: "",
  maintenance_mttr_mtbf: ""
};

const categoricalOptions = {
  plant: ["MS", "MN", "SB", "LTN1", "LTN4", "LTN3A", "LTN3B", "LTN3C", "LTN3D", "MH1", "MH2"],
  process: [
    "Cutting Machine Tube",
    "Cutting Machine Wire < 6mm2",
    "Cutting Machine Hot",
    "Cutting Machine Cable > 6mm2",
    "Twisting Machine",
    "Test Module",
    "Ultrasonic Welding Machine",
    "Taping Machine",
    "Shrinking Machine Processor",
    "Shrinking Machine Tunnel",
    "Crimping Press Wire < 6mm2",
    "Untwisting Machine",
    "Stripping Machine",
    "Shrinking Machine Shuttle",
    "Crimping Press Cable > 6mm2",
    "Soldering Machine Induction",
    "Soldering Bath",
    "Test Table",
    "Assembly Line DAL / LAD",
    "Test Board",
    "Welding Equipment",
    "Assembly Line Standard",
    "Assembly Line Carousel",
    "Test Station Fuse",
    "Cutting machine Tube",
    "Foaming Machine",
    "Micro Section Laboratories",
    "Crimping Tool",
    "Crimping Press Hydraulic",
    "Crimping Press Wire <6mm2",
    "LASER Wire MARKER",
    "Mini Assembly Line",
    "Press Equipment",
    "Bundle Machine",
    "Plug Insertion device",
    "Cutting Machine Universal",
    "Tape dispenser",
    "Screwing Machine",
    "Special Devices",
    "Assembly Line PGTF",
    "Test Station Fuse and Relaise",
    "Assembly Board",
    "Cutting machine tube",
    "Relaise Fuse Assembly",
    "Stripper Crimper",
    "Stripper Sealer Machine",
    "Clip Gun",
    "Tooling Others",
    "Resistance Welding Machine"
  ],
  master_data_name: [
    "Ulmer--SM 15/2P",
    "Komax--Alpha 355",
    "Komax--Gamma 333",
    "HSGM--HSG-G2S",
    "Komax--Alpha 355 S",
    "Komax--Alpha 433 S",
    "Komax--Alpha 433",
    "Komax--Kappa 330",
    "Schleuniger--PowerStrip 9550",
    "Komax--Kappa 240",
    "Komax--Alpha 488 S",
    "Komax--Alpha 550",
    "Komax--BT-188T",
    "Mecalbi--STCS-BLTTS",
    "Schunk--Minic III",
    "Kabatec--KTS 50 Comfort",
    "Mecalbi--STCS-VMir+",
    "Mecalbi--STCS-Evo500TS",
    "DSG Canusa--DERAY FST- 165/ 600",
    "Schunk--Minic II Automatic PC",
    "Kabatec--KTB E9P Taping Machine",
    "Schaefer--EPS 2001",
    "Komax--BT-752",
    "Komax--BT-722",
    "Schaefer--MC 2X1.5 Untwisting Machine",
    "Schleuniger--JS 8400",
    "Komax--Mira 230",
    "Schaefer--EPS 3000",
    "Mecalbi--STCS-CS19",
    "Mecalbi--STCS-RT",
    "Hanke--Crimpmatic 100 014",
    "Schaefer--EPS 15000",
    "Schaefer--EPS 10000",
    "Flacara Electric--Soldering System Unisold 2100",
    "Flacara Electric--Soldering System Unisold 2000",
    "LEONI WDEKI--Welding Bath",
    "Komax--Delta 60",
    "TSK--Test Table",
    "Vision Industrielle--Assembly Line Lad",
    "TSK--Test Board",
    "Schleuniger--PowerStrip 9500",
    "Ductimetal--LD02 Twister",
    "LEONI WDEKI--Twister 2005",
    "Schleuniger--UniStrip 2600",
    "Schaefer--EPS 3000 with Quality System SQS06",
    "Schaefer--EPS 6000",
    "LEONI WDEKI--Welding Device Verloten",
    "Raychem--IR-1891",
    "DSG Canusa--DERAY Shuttle RKS",
    "Kabatec--KTB 50 E Electric Bundling Machine",
    "Komax--Mira 340",
    "Ductimetal--Assembly Line Standard PL6",
    "LEONI WDEKI--Assembly Line Carousel",
    "LEONI WTNSO--Assembly Line Standard",
    "Emdep--Fuse Detection and Screwing",
    "Magistr--Soldering Bath",
    "Ulmer--SM15 2PT Universal Cutting Machin",
    "Schleuniger--CC64",
    "Schleuniger--CC36 S",
    "Komax--Alpha 477",
    "Hupeng--DTM01 Twister Machine",
    "Proeff--Twist 1000",
    "Mecalbi--STCS-VMir",
    "Mecalbi--STCS-Evo500",
    "Mecal--P107",
    "Leister--Dryer Ghilbi F",
    "Creasoft--Test Table",
    "Ductimetal--Assembly Line Carousel",
    "Emdep--Clip Test Bench",
    "Mecalbi--STCS-BM",
    "Hennecke--130 TI Foaming Machine",
    "Komax--Micro LAB 35",
    "Wezag--Crimping Tool EHC 10",
    "Schleuniger--MultiStrip 9480",
    "Komax--Alpha 356",
    "IT Intertool--T25 Press Machine",
    "Mecal--Crimping Press P200",
    "Lumberg--KHP 35",
    "presse  de sertissage sur isolant Stocko IDC",
    "Mecalbi--STCS-LC",
    "Divmac--Test Table",
    "Panasonic--LP-V Laser Markers",
    "SEA--Mini Assembly Line",
    "Mecalbi--Shrinking Tube Control System - VM",
    "Schmidt--Electric Press 345",
    "Ondal--Ondaliner",
    "Ondal--Bundler",
    "Stoneshield--RPM Robotic Punching Machine",
    "Isotherm--PSM90 Foaming Machine",
    "Ductimetal--Assembly Line Classic",
    "Raychem--RBK-X1C Heat Shrink Machine",
    "Mecalbi--STCS-RCM",
    "Mecal--P250I Crimping Machine",
    "Schleuniger--CT 42",
    "Komax--IOTA 330",
    "Schleuniger--CC36 SP",
    "Schleuniger--PowerStrip 9580 Cut & Strip Mach.",
    "Komax--Sigma 688 ST",
    "Schleuniger--OC 3950",
    "Komax--Gamma 450",
    "Komax--Alpha 530",
    "Kabatec--KTB 19 E Electric Bundling Machine",
    "Komax--BT-188",
    "Schleuniger--Pneumatic Press Machine SCP 2.5",
    "Raychem--RBK-ILS-Processor MKII",
    "Mecalbi--STCS-PT",
    "Kabatec--KTS 160 Comfort Tape Dispenser",
    "Kabatec--KTHB Smart Benchtop taping machine",
    "Kabatec--KTR 10 Taping Machine",
    "Kabatec--KT 2 Taping Machine",
    "TSK--Screwing Machine",
    "TSK--Fuse Detection",
    "TSK--Test Table 1700",
    "TSK--Vacuum Test",
    "Komax--Kappa 235",
    "Raychem--M19",
    "Schunk--DS20",
    "Emdep--Fuse Detection",
    "Iproeb--Assembly Line PGTF",
    "TSK--Fuse Detection + Screwing",
    "Kabatec--KTR 100 Taping Machine",
    "Kabatec--KTB 50 E Plus Electric Bundl Mach.",
    "Kabatec--KTS 50 A Tape dispenser",
    "Telsonic--Telsosplice TS3",
    "Creasoft--Fuse and Relay Detection",
    "Iproeb--Assembly Line Standard",
    "Messi--RAL 300 Assembly Line Standard",
    "Generic--HV Final Assembly&Ogc Board",
    "Machine de coupe Schlauch Ulmer SM 15/30 II",
    "Komax--BT-288",
    "Emdep--Screwing Machine TSBC",
    "Emdep--Screwing",
    "Komax--Micro LAB 55",
    "Vissage Rittal",
    "Emdep--Plug Insertion Press",
    "HSGM--HSG-G1S-100-T-A",
    "M.A.S.--Stripping Equipment",
    "Jacob--HDE-2B",
    "Revolon--Telwin PCP 18",
    "Weller--Well-EL-180W",
    "Dinefer--Tinning Inductive Machine",
    "Isojet Equipements--DPE IND1 Foaming Machine",
    "C-Tec Cable Technologies--Micrograph Laboratory",
    "Mecal--P150",
    "Mecal--P104",
    "Schaefer--EPS 2001 Stripper Crimper",
    "Raychem--RBK-ILS Processor MKIII",
    "Raychem--RBK-X1 Heat Shrink Machine",
    "Schleuniger--SealCrimp 210 B",
    "Schleuniger--StripCrimp 750",
    "Schunk--DS20-GT",
    "Schunk--Global-Splicer 40",
    "Schunk--Global-Splicer 40-Plus",
    "Schunk--Minic II Plus Automatic PC",
    "Schunk--Minic VI Automatic PC",
    "Komax--BT-288T",
    "Komax--Alpha 455",
    "Komax--Alpha 433 H",
    "Emdep--Clip Table",
    "Divmac--Fuse Detection",
    "Raychem--STCS-CS 19",
    "Schunk--Minic IV Plus Automatic PC",
    "Schleuniger--CC67 HD",
    "Metzner--SM 4000",
    "Ulmer--WSM 30E / WSM 60E",
    "Komax--Gamma 333 PC-B",
    "Komax--Alpha 488 s",
    "Komax--Gamma 333 PC",
    "Dinefer--Test Table",
    "LEONI WTNSO--Expander Grommet",
    "Bdtronic--B1000 Foaming Machine",
    "Raychem--Clip Gun",
    "Generic--Assembly Tooling",
    "Emdep--Test Board",
    "Rittal--Fuse Insertion",
    "Schneider--Unisold 750",
    "Schneider--Unisold 1000",
    "Komax--Mira 340Q",
    "Mecal--P080",
    "Schleuniger--US 2300"
  ],
  location: [
    "CuttingWirePreparation","PostAssemblyTesting","SpecialProcesses","Assembly"

  ]
};

export default function Prediction() {
  const [formData, setFormData] = useState(initialFormState);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateAge = (year) => {
    const currentYear = new Date().getFullYear();
    const y = Number(year);
    if (!isNaN(y) && y > 1900 && y <= currentYear) {
      return currentYear - y;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    const numericFields = [
      "year",
      "production_hours",
      
      "replacement_parts",
      "maintenance_mttr_mtbf"
    ];

    for (const field of numericFields) {
      if (formData[field] === "" || isNaN(formData[field])) {
        setError(`Please enter a valid number for ${field.replace(/_/g, " ")}`);
        return false;
      }
    }

    if (!categoricalOptions.plant.includes(formData.plant)) {
      setError("Please select a valid plant");
      return false;
    }

    if (!categoricalOptions.process.includes(formData.process)) {
      setError("Please select a valid process");
      return false;
    }

    if (!categoricalOptions.master_data_name.includes(formData.master_data_name)) {
      setError("Please select a valid master data name");
      return false;
    }

    if (!categoricalOptions.location.includes(formData.location)) {
      setError("Please select a valid location");
      return false;
    }

    const age = calculateAge(formData.year);
    if (age === null) {
      setError("Please enter a valid manufacturing year");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const calculatedAge = calculateAge(formData.year);
      const response = await axios.post("http://localhost:5050/predict", {
        ...formData,
        year: Number(formData.year),
       // age: calculatedAge,
        production_hours: Number(formData.production_hours),
        replacement_parts: Number(formData.replacement_parts),
        maintenance_mttr_mtbf: Number(formData.maintenance_mttr_mtbf)
      });
      setPrediction(response.data.predicted_rul);
    } catch (err) {
      setError("Prediction failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setPrediction(null);
    setError(null);
  };

  // Simple horizontal bar for RUL visualization
  const ProgressBar = ({ value, max }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    return (
      <div className="w-full bg-gray-200  rounded-full h-6 overflow-hidden shadow-inner mt-2">
        <div
          className={`h-6 rounded-full transition-all duration-500 ${
            percentage < 30 ? "bg-red-500" : percentage < 70 ? "bg-yellow-400" : "bg-green-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r mt-10 from-indigo-100 to-blue-50 py-10 px-5 md:px-20 lg:px-40">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">
          Equipment Remaining Useful Life Prediction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Equipment Details */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-indigo-300 pb-1">
              Equipment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["plant", "process", "master_data_name", "location"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block mb-1 font-semibold text-gray-600 capitalize"
                  >
                    {field.replace(/_/g, " ")}
                  </label>
                  <select
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select {field.replace(/_/g, " ")}</option>
                    {categoricalOptions[field].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div>
                <label
                  htmlFor="year"
                  className="block mb-1 font-semibold text-gray-600 capitalize"
                >
                  Manufacturing Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 2015"
                />
              </div>
            </div>
          </section>

          {/* Section: Operational Data */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-indigo-300 pb-1">
              Operational Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["production_hours", "replacement_parts", "maintenance_mttr_mtbf"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block mb-1 font-semibold text-gray-600 capitalize"
                  >
                    {field.replace(/_/g, " ")}
                  </label>
                  <input
                    type="number"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    step="any"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section: Commercialization */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-indigo-300 pb-1">
              Commercialization Status
            </h2>
            <div className="flex space-x-8">
              {["equipment_commercialized", "pdr_commercialized"].map((field) => (
                <label key={field} className="inline-flex items-center space-x-2 text-gray-700 font-semibold">
                  <input
                    type="checkbox"
                    id={field}
                    name={field}
                    checked={formData[field]}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span>{field.replace(/_/g, " ")}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Error message */}
          {error && <p className="text-red-600 font-semibold text-center">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold text-gray-700 transition"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white flex items-center space-x-2 transition disabled:opacity-50"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  />
                </svg>
              )}
              <span>{loading ? "Predicting..." : "Predict RUL"}</span>
            </button>
          </div>
        </form>

        {/* Prediction Result */}
        {prediction !== null && (
          <section className="mt-10 bg-indigo-50 rounded-lg p-6 text-center shadow-inner">
            <h2 className="text-2xl font-bold text-indigo-700 mb-2">
              Predicted Remaining Useful Life
            </h2>
            <p className="text-4xl font-extrabold text-indigo-900 mb-4">
              {prediction.toFixed()} years
            </p>

            <ProgressBar value={prediction} max={30} />

           
          </section>
        )}
      </div>
    </div>
  );
}
