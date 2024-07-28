// employeeList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./navBar";
import "./employeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [creatingEmployee, setCreatingEmployee] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Mobile: "",
    Designation: "",
    Gender: "",
    Course: [],
    Img: null,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:3000/api/employee/details",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees(response.data);
      setFilteredEmployees(response.data); // Initialize filtered employees
    } catch (err) {
      setError("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleShowEmployeeList = () => {
    setEditingEmployee(null);
    setCreatingEmployee(false);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      Name: employee.Name,
      Email: employee.Email,
      Mobile: employee.Mobile,
      Designation: employee.Designation,
      Gender: employee.Gender,
      Course: employee.Course.split(","),
      Img: null,
    });
    setCreatingEmployee(false);
  };

  const handleDeleteClick = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:3000/api/deleteEmployee/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchEmployees(); // Refresh the employee list after deletion
    } catch (err) {
      setError("Failed to delete employee");
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Course: prevFormData.Course.includes(value)
          ? prevFormData.Course.filter((course) => course !== value)
          : [...prevFormData.Course, value],
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === "file" ? files[0] : value,
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await axios.put(
        `http://localhost:3000/api/updateEmployee/update/${editingEmployee.UniqueId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchEmployees(); // Refresh the employee list after update
      setEditingEmployee(null);
      setSuccessMessage("Employee updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to update employee");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    console.log("Form data being sent:", formDataToSend);

    try {
      await axios.post(
        "http://localhost:3000/api/createEmployee/create",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchEmployees(); // Fetch the updated list of employees
      setCreatingEmployee(false);
      setSuccessMessage("Employee created successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to create employee");
    }
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setFilteredEmployees(employees);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/api/searchEmployee/search?name=${e.target.value}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.employees.length === 0) {
        setFilteredEmployees([]);
      } else {
        setFilteredEmployees(response.data.employees);
      }
    } catch (err) {
      setError("Failed to search employees");
    }
  };

  return (
    <div className="employee-list-container">
      <NavBar
        onLogout={handleLogout}
        onShowEmployeeList={handleShowEmployeeList}
      />
      <div className="employee-list-content">
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
        {!editingEmployee && !creatingEmployee ? (
          <>
            <h1>Employee List</h1>
            <button
              className="create-button"
              onClick={() => {
                setCreatingEmployee(true);
                setFormData({
                  Name: "",
                  Email: "",
                  Mobile: "",
                  Designation: "",
                  Gender: "",
                  Course: [],
                  Img: null,
                });
              }}
            >
              Create Employee
            </button>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearch}
              className="search-box"
            />
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Mobile</th>
                    <th>Designation</th>
                    <th>Gender</th>
                    <th>Course</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp, index) => (
                      <tr key={emp.UniqueId}>
                        <td>{index + 1}</td>
                        <td>
                          {emp.ImgUpload ? (
                            <img
                              src={`http://localhost:3000/uploads/${emp.ImgUpload.split(
                                "/"
                              ).pop()}`}
                              alt="Employee"
                              className="employee-image"
                              style={{ width: "50px", height: "50px" }} // Adjust size as needed
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>{emp.Name}</td>
                        <td>{emp.Email}</td>
                        <td>{new Date(emp.Createdate).toLocaleDateString()}</td>
                        <td>{emp.Mobile}</td>
                        <td>{emp.Designation}</td>
                        <td>{emp.Gender}</td>
                        <td>{emp.Course}</td>

                        <td>
                          <button onClick={() => handleEditClick(emp)}>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(emp.UniqueId)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="no-data">
                        {searchTerm ? "No results found" : "No employees found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="form-container">
            <h2>{editingEmployee ? "Edit Employee" : "Create Employee"}</h2>
            <form
              onSubmit={editingEmployee ? handleEditSubmit : handleCreateSubmit}
            >
              <label>
                Name:
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Mobile:
                <input
                  type="text"
                  name="Mobile"
                  value={formData.Mobile}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Designation:
                <select
                  name="Designation"
                  value={formData.Designation}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                </select>
              </label>
              <label>
                Gender:
                <div>
                  <label>
                    <input
                      type="radio"
                      name="Gender"
                      value="Male"
                      checked={formData.Gender === "Male"}
                      onChange={handleFormChange}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="Gender"
                      value="Female"
                      checked={formData.Gender === "Female"}
                      onChange={handleFormChange}
                    />
                    Female
                  </label>
                </div>
              </label>
              <label>
                Course:
                <div>
                  <label>
                    <input
                      type="checkbox"
                      value="MCA"
                      checked={formData.Course.includes("MCA")}
                      onChange={handleFormChange}
                    />
                    MCA
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="BCA"
                      checked={formData.Course.includes("BCA")}
                      onChange={handleFormChange}
                    />
                    BCA
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="BSC"
                      checked={formData.Course.includes("BSC")}
                      onChange={handleFormChange}
                    />
                    BSC
                  </label>
                </div>
              </label>
              <label>
                Image:
                <input
                  type="file"
                  name="ImgUpload"
                  onChange={handleFormChange}
                />
              </label>
              <button type="submit">
                {editingEmployee ? "Update Employee" : "Create Employee"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingEmployee(null);
                  setCreatingEmployee(false);
                  setFormData({
                    Name: "",
                    Email: "",
                    Mobile: "",
                    Designation: "",
                    Gender: "",
                    Course: [],
                    Img: null,
                  });
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
