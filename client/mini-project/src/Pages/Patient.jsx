import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5"; // Import the delete icon
import axios from "axios";
import "../Styles/Patient.css"; // Ensure this path is correct for your CSS file

export default function Patient() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // State to check if in edit mode
  const [selectedPatientId, setSelectedPatientId] = useState(null); // State to store selected patient ID
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [DOB, setDOB] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [patients, setPatients] = useState([]); // State to store fetched patient data

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
    if (isEditMode) {
      // Reset form if switching to add mode
      resetForm();
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setDOB("");
    setGender("");
    setAddress("");
    setIsEditMode(false);
    setSelectedPatientId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname && !lastname && !DOB && !gender && !address) {
      alert('Form Cannot be Submitted empty');
      return;
    }

    if (isEditMode) {
      // Update patient
      await axios.put(`http://localhost:3001/patient/${selectedPatientId}`, {
        firstname,
        lastname,
        DOB,
        gender,
        address,
      });
    } else {
      // Add new patient
      await axios.post("http://localhost:3001/patient", {
        firstname,
        lastname,
        DOB,
        gender,
        address,
      });
    }

    resetForm(); // Reset form fields
    setIsFormVisible(false);
    fetchPatientData(); // Fetch updated patient data
  };

  const fetchPatientData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getpatients");
      setPatients(response.data); // Set the fetched data to state
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const handleEdit = (patient) => {
    setFirstName(patient.firstname);
    setLastName(patient.lastname);
    setDOB(patient.DOB);
    setGender(patient.gender);
    setAddress(patient.address);
    setSelectedPatientId(patient._id);
    setIsEditMode(true); // Set edit mode to true
    setIsFormVisible(true); // Show form
  };

  const handleDelete = async (id) => {
    // Confirm deletion
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3001/patient/${id}`);
      fetchPatientData(); // Refresh the patient list after deletion
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  useEffect(() => {
    fetchPatientData(); // Fetch patient data when the component mounts
  }, []);

  return (
    <div>
      <div className="search-navbar">
        <div className="searchBox">
          <input
            type="text"
            placeholder="Enter the Patient Name to search.."
            className="searchInput"
          />
          <FaSearch className="searchIcon" />
        </div>
        <div className="add-patient">
          <button className="add-btn" onClick={toggleFormVisibility}>
            <CiEdit className="editIcon" />
            Add Patient
          </button>
        </div>
      </div>

      {isFormVisible && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label>First Name:</label>
              <input
                type="text"
                placeholder="Enter the firstname.."
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Last Name:</label>
              <input
                type="text"
                placeholder="Enter the lastname.."
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Date of Birth:</label>
              <input
                type="date"
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="input-field">
              <label>Address:</label>
              <input
                type="text"
                placeholder="Enter the Address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="Address-field"
              />
            </div>
            <div className="submit-button">
              <button type="submit" className="submit-btn">
                {isEditMode ? 'Update' : 'Add'} {/* Change button text based on mode */}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table to display patients */}
      <div className="header">
        <h1>Patient List</h1>
      </div>
      <div className="patient-table">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Action</th> {/* New Action column */}
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.firstname}</td>
                <td>{patient.lastname}</td>
                <td>{new Date(patient.DOB).toLocaleDateString()}</td>
                <td>{patient.gender}</td>
                <td>{patient.address}</td>
                <td>
                  <CiEdit
                    className="editIcon"
                    onClick={() => handleEdit(patient)} // Call edit handler
                  />
                  <IoTrashOutline
                    className="deleteIcon"
                    onClick={() => handleDelete(patient._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
