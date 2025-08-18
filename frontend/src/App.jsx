import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CarUpload from "./CarUpload";
import CarList from "./CarList";
import CarDetail from "./CarDetail";
import CarUpdate from "./CarUpdate";
import CarDelete from "./CarDelete";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUpload = () => {
    setRefresh(!refresh);
  };

  return (
    <Router>
      <div className="App">
        <h1>Car Management System 🚗</h1>

        {/* Navigation Menu */}
        <nav>
          <Link to="/">Car List</Link> |{" "}
          <Link to="/upload">Upload Car</Link>
        </nav>

        <Routes>
          {/* List all cars */}
          <Route path="/" element={<CarList refresh={refresh} />} />

          {/* Upload a new car */}
          <Route path="/upload" element={<CarUpload onUpload={handleUpload} />} />

          {/* Car details (dynamic ID) */}
          <Route path="/cars/:id" element={<CarDetail />} />

          {/* Update car (dynamic ID) */}
          <Route path="/cars/:id/update" element={<CarUpdate onUpdate={handleUpload} />} />

          {/* Delete car (dynamic ID) */}
          <Route path="/cars/:id/delete" element={<CarDelete onDelete={handleUpload} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

