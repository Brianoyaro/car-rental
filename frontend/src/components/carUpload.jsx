import { useState } from "react";
import axios from "axios";

export default function CarUpload({ onUpload }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
  });
  const [images, setImages] = useState([]); // store multiple images

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    // limit to 10 images
    const files = Array.from(e.target.files).slice(0, 10);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // append text fields
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // append multiple images
    images.forEach((img) => {
      data.append("images", img); // backend should expect `images`
    });

    try {
      const res = await axios.post(`${backendURL}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpload(res.data); // update parent state
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="text" name="brand" placeholder="Brand" onChange={handleChange} required />
      <input type="text" name="model" placeholder="Model" onChange={handleChange} required />
      <input type="number" name="year" placeholder="Year" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      
      {/* allow multiple uploads */}
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        accept="image/*"
      />
      <p>{images.length} file(s) selected</p>

      <button type="submit">Upload Car</button>
    </form>
  );
}

