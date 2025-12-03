import axios from 'axios';
import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export default function EquipmentForm() {
  const [formValues, setFormValues] = useState({
    equipmentName: "",
    serialNumber: "",
    immobilizationNumber: "",
    plant: "",
    location: "",
    technicalId: "",
    process: "",
    masterDataName: "",
    equipmentCommercialized: "",
    pdrCommercialized: "",
    year: "",
    age: "",
    degradability: "",
    productionHours: "",
    hpCoefficient: "",
    replacementParts: "",
    maintenanceMttrMtbf: "",
    technology: "",
    agingResult: "",
    equipmentStatus: "",
    physicalStatus: "",
    files: [],
  });

  const [csvFile, setCsvFile] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setFormValues({ ...formValues, files: [...formValues.files, ...newFiles] });
  };

  const handleRemoveFile = (fileToRemove) => {
    setFormValues({
      ...formValues,
      files: formValues.files.filter((file) => file !== fileToRemove),
    });
  };

  const handleClear = () => {
    setFormValues({
      equipmentName: "",
      serialNumber: "",
      immobilizationNumber: "",
      plant: "",
      location: "",
      technicalId: "",
      process: "",
      masterDataName: "",
      equipmentCommercialized: "",
      pdrCommercialized: "",
      year: "",
      age: "",
      degradability: "",
      productionHours: "",
      hpCoefficient: "",
      replacementParts: "",
      maintenanceMttrMtbf: "",
      technology: "",
      agingResult: "",
      equipmentStatus: "",
      physicalStatus: "",
      files: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (key !== 'files') formData.append(key, formValues[key]);
    });
    formValues.files.forEach((file) => {
      formData.append('documents', file);
    });

    try {
      const response = await axios.post('http://svtn3local01:9095/api/equipment/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("✅ Equipment added successfully!");
        handleClear();
      }
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.message || error?.response?.data || "Unknown error.";
      toast.error(`❌ ${msg}`);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.error("❌ Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const response = await axios.post("http://svtn3local01:9095/api/equipment/upload-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("✅ CSV uploaded successfully!");
        setCsvFile(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ CSV upload failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-12 border rounded-lg shadow-lg bg-white">
      <button onClick={() => navigate(-1)} className="text-blue-700 underline text-sm">Return</button>
      <h1 className="text-4xl font-bold text-blue-900 mt-2">LEONI</h1>
      <hr className="my-4 border-gray-300" />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Equipment Name" name="equipmentName" value={formValues.equipmentName} onChange={handleInputChange} />
          <Input label="Serial Number" name="serialNumber" value={formValues.serialNumber} onChange={handleInputChange} />
          <Input label="Immobilization Number" name="immobilizationNumber" value={formValues.immobilizationNumber} onChange={handleInputChange} />
          <Select label="Plant" name="plant" value={formValues.plant} onChange={handleInputChange} options={["MN", "MS1", "MS2", "MS3", "SB", "LTN3A", "LTN3B", "LTN3C", "LTN3D", "LTN1", "LTN4", "LTN2", "MH1", "MH2"]} />
          <Select label="Location" name="location" value={formValues.location} onChange={handleInputChange} options={["CuttingWirePreparation","PostAssemblyTesting","SpecialProcesses","Assembly"]} />
          <Input label="Technical ID" name="technicalId" value={formValues.technicalId} onChange={handleInputChange} />
          <Input label="Process" name="process" value={formValues.process} onChange={handleInputChange} />
          <Input label="Master Data Name" name="masterDataName" value={formValues.masterDataName} onChange={handleInputChange} />
          <Select label="Equipment Commercialized" name="equipmentCommercialized" value={formValues.equipmentCommercialized} onChange={handleInputChange} options={["true", "false"]} />
          <Select label="PDR Commercialized" name="pdrCommercialized" value={formValues.pdrCommercialized} onChange={handleInputChange} options={["true", "false"]} />
          <Input label="Year" name="year" value={formValues.year} onChange={handleInputChange} />
          <Input label="Age" name="age" value={formValues.age} onChange={handleInputChange} />
          <Input label="Degradability" name="degradability" value={formValues.degradability} onChange={handleInputChange} />
          <Input label="Production Hours" name="productionHours" value={formValues.productionHours} onChange={handleInputChange} />
          <Input label="Replacement Parts" name="replacementParts" value={formValues.replacementParts} onChange={handleInputChange} />
          <Input label="Maintenance MTTR/MTBF" name="maintenanceMttrMtbf" value={formValues.maintenanceMttrMtbf} onChange={handleInputChange} />
          <Input label="Technology" name="technology" value={formValues.technology} onChange={handleInputChange} />
          <Input label="Equipment Status" name="equipmentStatus" value={formValues.equipmentStatus} onChange={handleInputChange} />
        </div>

        <div className="mt-6">
          <FileUpload label="Upload Documents" onChange={handleFileUpload} files={formValues.files} onRemove={handleRemoveFile} />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button type="submit" className="px-6 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50">Save</button>
          <button type="button" onClick={handleClear} className="px-6 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50">Clear</button>
        </div>
      </form>

      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Bulk Upload via CSV</h2>
        <p className="text-sm text-gray-500 mb-4">Upload a `.csv` file with multiple equipment entries.</p>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
            className="block text-sm"
          />
          <button
            type="button"
            onClick={handleCsvUpload}
            className="px-6 py-2 border border-blue-600 text-blue-700 rounded hover:bg-blue-50"
          >
            Upload CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-600 mb-1" htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      type="text"
      className="w-full px-4 py-2 border rounded-full text-gray-700 focus:ring focus:outline-none"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-gray-600 mb-1" htmlFor={name}>{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-full text-gray-700 appearance-none focus:ring focus:outline-none"
    >
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const FileUpload = ({ label, onChange, files = [], onRemove }) => (
  <div className="border-2 border-dashed border-gray-400 p-4 rounded-lg">
    <div className="flex flex-col items-center justify-center text-center min-h-[100px]">
      <UploadCloud className="w-8 h-8 text-blue-700" />
      <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
      <label className="text-blue-700 underline cursor-pointer mt-2">
        Upload a file
        <input type="file" onChange={onChange} className="hidden" multiple />
      </label>
    </div>

    {files.length > 0 && (
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-600 mb-2">Uploaded Files:</p>
        <ul className="space-y-1 text-sm text-gray-800">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded border">
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => onRemove(file)}
                className="text-red-500 hover:text-red-700 text-xs font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
