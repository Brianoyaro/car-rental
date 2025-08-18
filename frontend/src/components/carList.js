import { useEffect, useState } from "react";
import axios from "axios";

export default function CarList({ refresh }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/cars").then((res) => setCars(res.data));
  }, [refresh]);

  return (
    <div>
      <h2>Car Listings</h2>
      {cars.map((car) => (
        <div
          key={car._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <h3>
            {car.brand} {car.model} ({car.year})
          </h3>
          <p>Price: ${car.price}</p>

          {/* render up to 10 images */}
          {car.images && car.images.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {car.images.slice(0, 10).map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl} // hosted in Cloudinary
                  alt={`${car.brand} ${car.model} - ${idx + 1}`}
                  width="200"
                  style={{ borderRadius: "6px" }}
                />
              ))}
            </div>
          ) : (
            <p>No images available</p>
          )}
        </div>
      ))}
    </div>
  );
}

