import { useEffect, useState } from "react";
import axios from "axios";

export default function CarDetails({ carId, onBack }) {
  const [car, setCar] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/cars/${carId}`)
      .then((res) => setCar(res.data))
      .catch((err) => console.error(err));
  }, [carId]);

  if (!car) return <p>Loading car details...</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px" }}>
      <h2>{car.make} {car.model} ({car.manufactureYear})</h2>
      <p><strong>License Plate:</strong> {car.licensePlate}</p>
      <p><strong>Status:</strong> {car.status}</p>
      <p><strong>Price per day:</strong> ${car.pricePerDay}</p>

      {car.images && car.images.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {car.images.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`${car.make} ${car.model} - ${idx + 1}`}
              width="200"
              style={{ borderRadius: "6px" }}
            />
          ))}
        </div>
      )}

      <button onClick={onBack}>Back</button>
    </div>
  );
}

