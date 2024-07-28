
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './navBar';
import './employeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [creatingEmployee, setCreatingEmployee] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Mobile: '',
    Designation: '',
    Gender: '',
    Course: [],
    Img: null,
  });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      return;
    }
    try {
      const response = await axios.get('http://localhost:3000/api/employee/details', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
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
      Course: employee.Course.split(','),
      Img: null,
    });
    setCreatingEmployee(false);
  };

  const handleDeleteClick = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/deleteEmployee/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(employees.filter(emp => emp.UniqueId !== id));
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'checkbox') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Course: prevFormData.Course.includes(value)
          ? prevFormData.Course.filter((course) => course !== value)
          : [...prevFormData.Course, value],
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === 'file' ? files[0] : value,
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      return;
    }
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await axios.put(`http://localhost:3000/api/updateEmployee/update/${editingEmployee.UniqueId}`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setEmployees(employees.map(emp => emp.UniqueId === editingEmployee.UniqueId ? { ...emp, ...formData } : emp));
      setEditingEmployee(null);
      setSuccessMessage('Employee updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update employee');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      return;
    }
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/createEmployee/create', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      await fetchEmployees(); // Fetch the updated list of employees
      setCreatingEmployee(false);
      setSuccessMessage('Employee created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to create employee');
    }
  };

  return (
    <div className="employee-list-container">
      <NavBar onLogout={handleLogout} onShowEmployeeList={handleShowEmployeeList} />
      <div className="employee-list-content">
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
        {!editingEmployee && !creatingEmployee ? (
          <>
            <h1>Employee List</h1>
            <button className='create-button' onClick={() => setCreatingEmployee(true)}>Create Employee</button>
            <div className="table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Mobile</th>
                    <th>Designation</th>
                    <th>Gender</th>
                    <th>Course</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map(emp => (
                      <tr key={emp.UniqueId}>
                        <td>{emp.Name}</td>
                        <td>{emp.Email}</td>
                        <td>{emp.UniqueId}</td>
                        <td>{new Date(emp.Createdate).toLocaleDateString()}</td>
                        <td>{emp.Mobile}</td>
                        <td>{emp.Designation}</td>
                        <td>{emp.Gender}</td>
                        <td>{emp.Course}</td>
                        <td>
                          <button onClick={() => handleEditClick(emp)}>Edit</button>
                          <button onClick={() => handleDeleteClick(emp.UniqueId)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="no-data">No employees found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="form-container">
            <h2>{editingEmployee ? 'Edit Employee' : 'Create Employee'}</h2>
            <form onSubmit={editingEmployee ? handleEditSubmit : handleCreateSubmit}>
              <label>Name</label>
              <input type="text" name="Name" value={formData.Name} onChange={handleFormChange} />

              <label>Email</label>
              <input type="email" name="Email" value={formData.Email} onChange={handleFormChange} />

              <label>Mobile No</label>
              <input type="text" name="Mobile" value={formData.Mobile} onChange={handleFormChange} />

              <label>Designation</label>
              <select name="Designation" value={formData.Designation} onChange={handleFormChange}>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
              </select>

              <div className="radio-group">
                <label>
                  <input type="radio" name="Gender" value="Male" checked={formData.Gender === 'Male'} onChange={handleFormChange} />
                  Male
                </label>
                <label>
                  <input type="radio" name="Gender" value="Female" checked={formData.Gender === 'Female'} onChange={handleFormChange} />
                  Female
                </label>
              </div>

              <div className="checkbox-group">
                <label>
                  <input type="checkbox" name="Course" value="MCA" checked={formData.Course.includes('MCA')} onChange={handleFormChange} />
                  MCA
                </label>
                <label>
                  <input type="checkbox" name="Course" value="BCA" checked={formData.Course.includes('BCA')} onChange={handleFormChange} />
                  BCA
                </label>
                <label>
                  <input type="checkbox" name="Course" value="MBA" checked={formData.Course.includes('MBA')} onChange={handleFormChange} />
                  MBA
                </label>
              </div>

              <label>Img Upload</label>
              <input type="file" name="Img" onChange={handleFormChange} />

              <button type="submit">{editingEmployee ? 'Update' : 'Create'}</button>
              

              <button type="button" onClick={() => { setEditingEmployee(null); setCreatingEmployee(false); }}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
