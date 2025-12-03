import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Download } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const DocumentList = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEquipment = async () => {
    try {
 

      const response = await axios.get(`http://svtn3local01:9095/api/equipment/${id}`);

      setEquipment(response.data);
      toast.success("Equipment loaded successfully!");
    } catch (error) {
      toast.error("Failed to load equipment.");
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-white text-xl">Loading...</h2>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Equipment not found</h2>
          <button onClick={() => navigate(-1)} className="hover:underline text-blue-300">
            Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl bg-bluedark text-white shadow-lg rounded-lg p-6">
        <button onClick={() => navigate(-1)} className="hover:underline mb-4">
          Return
        </button>

        <h2 className="text-2xl font-bold mt-2">Browse Document :</h2>
        <hr className="border-gray-300 my-2" />

        <div className="mt-4 space-y-1">
          <p>
            <span className="font-bold underline">Equipement Name:</span>{" "}
            {equipment.equipmentName}
          </p>
          <p>
            <span className="font-bold underline">Serial Number:</span>{" "}
            {equipment.serialNumber}
          </p>
         
          <p>
            <span className="font-bold underline">Process:</span>{" "}
            {equipment.process || "Unknown"}
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 mt-6 bg-white text-gray-800 rounded-lg shadow-md">
          {equipment.documents && equipment.documents.length > 0 ? (
            equipment.documents.map((doc, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-500" />
                  <span className="font-medium">{doc.name}</span>
                </div>
                <div>
                  <a  href={`http://svtn3local01:9095/api/documents/download/${doc.name}`}
                      download
                      className="p-2 flex gap-2 items-center cursor-pointer bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                      Download <Download size={18} />
                  </a>

                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No documents available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
