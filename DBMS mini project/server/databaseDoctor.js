// database.js
const mongoose = require("mongoose");

// Define the Patient schema
const doctorSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  doctorId: { type: String, required: true },
  gender: { type: String, required: true },
  specialization: { type: String, required: true },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor; // Export the model
