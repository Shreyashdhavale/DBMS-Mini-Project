import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Navbar = () => {

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-brand">Brand</div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/patient">Patient</Link>
          <Link to="/doctor">Doctor</Link>
        </div>
      </nav>

    </div>
  );
};

export default Navbar;
