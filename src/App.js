import { Route, Routes } from "react-router-dom"
//import Land from "./component/Landpage"
import Test from "./components/Register_Login"
import Dashboard from "./components/Dashboard"
//import axios from "axios";
//import { useNavigate } from "react-router-dom";



function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/dashboard/:name/:user_id" element={<Dashboard />} />

      </Routes>
    </div>
  );
}

export default App;


