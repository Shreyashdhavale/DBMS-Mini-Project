const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const  Patient = require('./databasePatient')
const  Doctor = require('./databaseDoctor')

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/add", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("Database Connected"))
    .catch((error) => console.error("Database connection error:", error));



//patient get
app.get("/getpatients", async (req, res) => {
  const search = req.query.search || "";
  try {
    const patients = await Patient.find({
      $or: [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
      ],
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//doctor get
app.get("/getdoctor", async (req, res) => {
  const search = req.query.search || "";
  try {
    const doctors = await Doctor.find({
      $or: [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
      ],
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//patient post
app.post("/patient", async (req, res) => {
  const patient = new Patient(req.body);
  try {
    const savedPatient = await patient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//doctor post
app.post("/doctor", async (req, res) => {
  const doctor = new Doctor(req.body);
  try {
    const savedDoctor = await doctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//patient put
app.put("/patient/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//doctor put
app.put("/doctor/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// patient delete
app.delete("/patient/:id", async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// doctor delete
app.delete("/doctor/:id", async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
