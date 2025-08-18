import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
            {car.make} {car.model} ({car.manufactureYear})
          </h3>
          <p>Price per day: ${car.pricePerDay}</p>

          {/* render up to 10 images */}
          {car.images && car.images.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {car.images.slice(0, 10).map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl} // hosted in Cloudinary
                  alt={`${car.make} ${car.model} - ${idx + 1}`}
                  width="200"
                  style={{ borderRadius: "6px" }}
                />
              ))}
            </div>
          ) : (
            <p>No images available</p>
          )}

          {/* Action Links */}
          <div style={{ marginTop: "10px" }}>
            <Link to={`/cars/${car._id}`} style={{ marginRight: "10px" }}>
              View
            </Link>
            <Link to={`/cars/${car._id}/update`} style={{ marginRight: "10px" }}>
              Update
            </Link>
            <Link to={`/cars/${car._id}/delete`} style={{ color: "red" }}>
              Delete
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

