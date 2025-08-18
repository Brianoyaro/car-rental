import { useState } from "react";
import CarUpload from "./CarUpload";
import CarList from "./CarList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleUpload = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="App">
      <h1>Car Upload System</h1>
      <CarUpload onUpload={handleUpload} />
      <CarList refresh={refresh} />
    </div>
  );
}

export default App;

