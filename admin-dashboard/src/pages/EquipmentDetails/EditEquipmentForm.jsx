import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

const EditEquipmentForm = ({ equipment, onSave, onCancel }) => {
  const token = localStorage.getItem("token");

  const [formValues, setFormValues] = useState({
    plant: "",
    equipmentName: "",
    technicalId: "",
    process: "",
    masterDataName: "",
    location: "",
    immobilizationNumber: "",
    serialNumber: "",
    year: "",
    equipmentCommercialized: false,
    pdrCommercialized: false,
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
    newFiles: [],
    existingDocs: [],
  });

  const [archivedDocs, setArchivedDocs] = useState([]);

  useEffect(() => {
    if (equipment) {
      setFormValues((prev) => ({
        ...prev,
        ...equipment,
        newFiles: [],
        existingDocs: equipment.documents || [],
      }));
      setArchivedDocs(equipment.archive || []);
    }
  }, [equipment]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormValues((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...newFiles],
    }));
  };

  const handleRemoveNewFile = (fileToRemove) => {
    setFormValues((prev) => ({
      ...prev,
      newFiles: prev.newFiles.filter((file) => file !== fileToRemove),
    }));
  };

  const handleRemoveDoc = async (docToRemove, isArchived = false) => {
    try {
      const response = await axios.delete(
        `http://svtn3local01:9095/api/documents/${docToRemove.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(`🗑️ Deleted ${docToRemove.name}`);
        if (isArchived) {
          setArchivedDocs((prev) => prev.filter((doc) => doc.id !== docToRemove.id));
        } else {
          setFormValues((prev) => ({
            ...prev,
            existingDocs: prev.existingDocs.filter((doc) => doc.id !== docToRemove.id),
          }));
        }
      }
    } catch (error) {
      toast.error(`❌ Failed to delete ${docToRemove.name}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (["newFiles", "existingDocs"].includes(key)) return;
      formDataToSend.append(key, value);
    });

    if (equipment?.id) {
      formDataToSend.append("id", equipment.id);
    }

    formDataToSend.append(
      "retainedDocs",
      JSON.stringify(formValues.existingDocs.map((doc) => doc.name))
    );

    formValues.newFiles.forEach((file) => {
      formDataToSend.append("documents", file);
    });

    try {
      const response = await axios.post(
        `http://svtn3local01:9095/api/equipment/update/${formValues.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("✅ Equipment updated successfully!");
        onSave?.();
      }
    } catch (error) {
      toast.error("❌ Failed to update equipment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4" encType="multipart/form-data">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Equipment Name" name="equipmentName" value={formValues.equipmentName} onChange={handleInputChange} />
        <Input label="Technical ID" name="technicalId" value={formValues.technicalId} onChange={handleInputChange} />
        <Input label="Serial Number" name="serialNumber" value={formValues.serialNumber} onChange={handleInputChange} />
        <Input label="Immobilization Number" name="immobilizationNumber" value={formValues.immobilizationNumber} onChange={handleInputChange} />
        <Input label="Master Data Name" name="masterDataName" value={formValues.masterDataName} onChange={handleInputChange} />
        <Input label="Process" name="process" value={formValues.process} onChange={handleInputChange} />
        <Input label="Plant" name="plant" value={formValues.plant} onChange={handleInputChange} />
        <Input label="Location" name="location" value={formValues.location} onChange={handleInputChange} />
        <Input label="Year" name="year" value={formValues.year} onChange={handleInputChange} />
        <Input label="Age" name="age" value={formValues.age} onChange={handleInputChange} />
        <Input label="Degradability" name="degradability" value={formValues.degradability} onChange={handleInputChange} />
        <Input label="Production Hours" name="productionHours" value={formValues.productionHours} onChange={handleInputChange} />
        <Input label="HP Coefficient" name="hpCoefficient" value={formValues.hpCoefficient} onChange={handleInputChange} />
        <Input label="Replacement Parts" name="replacementParts" value={formValues.replacementParts} onChange={handleInputChange} />
        <Input label="MTTR/MTBF" name="maintenanceMttrMtbf" value={formValues.maintenanceMttrMtbf} onChange={handleInputChange} />
        <Input label="Technology" name="technology" value={formValues.technology} onChange={handleInputChange} />
        <Input label="Aging Result" name="agingResult" value={formValues.agingResult} onChange={handleInputChange} />
        <Input label="Equipment Status" name="equipmentStatus" value={formValues.equipmentStatus} onChange={handleInputChange} />
        <Input label="Physical Status" name="physicalStatus" value={formValues.physicalStatus} onChange={handleInputChange} />
        <Checkbox label="Equipment Commercialized" name="equipmentCommercialized" checked={formValues.equipmentCommercialized} onChange={handleInputChange} />
        <Checkbox label="PDR Commercialized" name="pdrCommercialized" checked={formValues.pdrCommercialized} onChange={handleInputChange} />
      </div>

      <div className="mt-6">
        <FileUpload
          label="Upload a file"
          onChange={handleFileUpload}
          files={formValues.newFiles}
          onRemove={handleRemoveNewFile}
        />

        {formValues.existingDocs.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">Existing Documents:</p>
            <ul className="space-y-1 text-sm text-gray-800">
              {formValues.existingDocs.map((doc, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded border">
                  <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                    {doc.name}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc, false)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {archivedDocs.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-600 mb-2">Archived Documents:</p>
            <ul className="space-y-1 text-sm text-gray-800">
              {archivedDocs.map((doc, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded border">
                  <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                    {doc.name}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc, true)}
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

      <div className="flex justify-end gap-4 mt-6">
        <button type="submit" className="px-6 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50">
          Save
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-400 text-gray-600 rounded hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </form>
  );
};

// Reusable UI components
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-full text-gray-700 focus:ring focus:outline-none"
    />
  </div>
);

const Checkbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center gap-2 mt-2">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} />
    <label className="text-gray-600">{label}</label>
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
        <p className="text-sm font-semibold text-gray-600 mb-2">New Files:</p>
        <ul className="space-y-1 text-sm text-gray-800">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded border"
            >
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

export default EditEquipmentForm;
