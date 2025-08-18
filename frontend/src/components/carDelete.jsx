require("dotenv").config();


import axios from "axios";

export default function CarDelete({ carId, onDelete }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await axios.delete(`${backendURL}/${carId}`);
      onDelete(carId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleDelete} style={{ color: "red", marginTop: "10px" }}>
      Delete Car
    </button>
  );
}

