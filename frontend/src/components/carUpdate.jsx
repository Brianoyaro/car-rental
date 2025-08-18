import { useState } from "react";
import axios from "axios";

export default function CarUpdate({ car, onUpdate }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    make: car.make,
    model: car.model,
    manufactureYear: car.manufactureYear,
    licensePlate: car.licensePlate,
    pricePerDay: car.pricePerDay,
    status: car.status,
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    images.forEach((img) => {
      data.append("images", img);
    });

    try {
      const res = await axios.put(`${backendURL}/${car._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpdate(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
      <input type="text" name="make" value={formData.make} onChange={handleChange} required />
      <input type="text" name="model" value={formData.model} onChange={handleChange} required />
      <input type="number" name="manufactureYear" value={formData.manufactureYear} onChange={handleChange} required />
      <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} required />
      <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="available">Available</option>
        <option value="rented">Rented</option>
        <option value="maintenance">Maintenance</option>
      </select>

      <input type="file" multiple accept="image/*" onChange={handleImageChange} />
      <button type="submit">Update Car</button>
    </form>
  );
}

