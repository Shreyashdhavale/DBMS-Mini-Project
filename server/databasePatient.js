// database.js
const mongoose = require("mongoose");


  
  // Define the Patient schema
  const patientSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    DOB: { type: Date, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
  });
  
const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient; // Export the model
