// src/components/EmployeeList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './navBar';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchEmployees = async () => {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          setError('No token found');
          return;
        }
      try {
        const response = await axios.get('http://localhost:3000/api/employee/details', {
            headers: { Authorization: `Bearer ${token}` } // Include token in headers
          });
        setEmployees(response.data);
      
      } catch (err) {
        setError('Failed to fetch employees');
      }
    };

    fetchEmployees();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <NavBar onLogout={handleLogout} />
      <h1>Employee List</h1>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.UniqueId}>
              <td>{emp.Name}</td>
              <td>{emp.Email}</td>
              <td>{emp.Mobile}</td>
              <td>{emp.Designation}</td>
              <td>{emp.Gender}</td>
              <td>{emp.Course}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
