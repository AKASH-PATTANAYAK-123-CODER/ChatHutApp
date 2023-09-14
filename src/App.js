import { Route, Routes } from "react-router-dom"
import Test from "./components/Register_Login"
import Dashboard from "./components/Dashboard"
import { useEffect } from "react";
import { useState } from "react";




function App() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  return (
    <div>
      {isMobile ? (
        <h1>This is Not Compatible in Mobile Please open in Desktop or Desktop site</h1>
      ) : (
        <Routes>
          <Route path="/" element={<Test />} />
          <Route path="/dashboard/:name/:user_id" element={<Dashboard />} />
        </Routes>
      )}
    </div>
  );
}

export default App;


