import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./containers/Login";
import Home from "./containers/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
