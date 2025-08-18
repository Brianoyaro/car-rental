import axios from "axios";

export default function CarDelete({ carId, onDelete }) {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/cars/${carId}`);
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

