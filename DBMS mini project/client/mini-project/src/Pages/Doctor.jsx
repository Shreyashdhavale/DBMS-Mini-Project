import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5"; // Import the delete icon
import axios from "axios";
import "../Styles/Patient.css"; // Ensure this path is correct for your CSS file

export default function Patient() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // State to check if in edit mode
  const [selectedDoctorId, setSelectedDoctorId] = useState(null); // State to store selected doctor ID
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]); // State to store fetched doctor data
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

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
    setDoctorId("");
    setGender("");
    setSpecialization("");
    setIsEditMode(false);
    setSelectedDoctorId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !doctorId || !gender || !specialization) {
      alert('Form cannot be submitted empty');
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:3001/doctor/${selectedDoctorId}`, {
          firstname,
          lastname,
          doctorId,
          gender,
          specialization,
        });
      } else {
        await axios.post("http://localhost:3001/doctor", {
          firstname,
          lastname,
          doctorId,
          gender,
          specialization,
        });
      }

      resetForm();
      setIsFormVisible(false);
      fetchDoctorData();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const fetchDoctorData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/getdoctor", {
        params: { search: searchTerm },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  const handleEdit = (doctor) => {
    setFirstName(doctor.firstname);
    setLastName(doctor.lastname);
    setDoctorId(doctor.doctorId);
    setGender(doctor.gender);
    setSpecialization(doctor.specialization);
    setSelectedDoctorId(doctor._id);
    setIsEditMode(true); // Set edit mode to true
    setIsFormVisible(true); // Show form
  };

  const handleDelete = async (id) => {
    // Confirm deletion
    const confirmed = window.confirm("Are you sure you want to delete this Doctor?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3001/doctor/${id}`);
      fetchDoctorData(); // Refresh the doctor list after deletion
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  useEffect(() => {
    fetchDoctorData(); // Fetch doctor data when the component mounts
  }, [searchTerm]); // Refetch when searchTerm changes

  return (
    <div>
      <div className="search-navbar">
        <div className="searchBox">
          <input
            type="text"
            placeholder="Enter the Doctor Name to search.."
            className="searchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="searchIcon" />
        </div>
        <div className="add-Doctor">
          <button className="add-btn" onClick={toggleFormVisibility}>
            <CiEdit className="editIcon" />
            Add Doctor
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
              <label>Doctor ID:</label>
              <input
                type="text"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
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
              <label>Specialization:</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="Address-field"
              />
            </div>
            <div className="submit-button">
              <button type="submit" className="submit-btn">
                {isEditMode ? 'Update' : 'Add'} 
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="header">
        <h1>Doctor List</h1>
      </div>
      <div className="patient-table">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Doctor ID</th>
              <th>Gender</th>
              <th>Specialization</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor.firstname}</td>
                <td>{doctor.lastname}</td>
                <td>{doctor.doctorId}</td>
                <td>{doctor.gender}</td>
                <td>{doctor.specialization}</td>
                <td>
                  <CiEdit
                    className="editIcon"
                    onClick={() => handleEdit(doctor)}
                  />
                  <IoTrashOutline
                    className="deleteIcon"
                    onClick={() => handleDelete(doctor._id)}
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
