// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
// import Home from "./Navbar"; // Create these components as needed
// import Services from "./Services";
// import About from "./About";
import Patient from  "./Pages/Patient";
import Doctor from "./Pages/Doctor"
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* /* <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} /> */}
        <Route path="/patient" element={<Patient />} /> 
        <Route path="/doctor" element={<Doctor />} /> 
        </Routes>
       </Router>
  );
};

export default App;
