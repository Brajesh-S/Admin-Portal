// // EmployeeList.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import NavBar from './navBar';
// import './employeeList.css';

// const EmployeeList = () => {
//   const [employees, setEmployees] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('No token found');
//         return;
//       }
//       try {
//         const response = await axios.get('http://localhost:3000/api/employee/details', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setEmployees(Array.isArray(response.data) ? response.data : []);
//       } catch (err) {
//         setError('Failed to fetch employees');
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/';
//   };

//   return (
//     <div className="employee-list-container">
//       <NavBar onLogout={handleLogout} />
//       <div className="employee-list-content">
//         <h1>Employee List</h1>
//         {error && <p className="error-message">{error}</p>}
//         <div className="table-container">
//           <table className="employee-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Mobile</th>
//                 <th>Designation</th>
//                 <th>Gender</th>
//                 <th>Course</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.length > 0 ? (
//                 employees.map(emp => (
//                   <tr key={emp.UniqueId}>
//                     <td>{emp.Name}</td>
//                     <td>{emp.Email}</td>
//                     <td>{emp.Mobile}</td>
//                     <td>{emp.Designation}</td>
//                     <td>{emp.Gender}</td>
//                     <td>{emp.Course}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="no-data">No employees found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './navBar';
import './employeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Mobile: '',
    Designation: '',
    Gender: '',
    Course: '',
    Img: null,
  });

  useEffect(() => {
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
        setEmployees(Array.isArray(response.data) ? response.data : []);
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

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      Name: employee.Name,
      Email: employee.Email,
      Mobile: employee.Mobile,
      Designation: employee.Designation,
      Gender: employee.Gender,
      Course: employee.Course,
      Img: null,
    });
  };

  const handleDeleteClick = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/employee/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
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
      await axios.put(`http://localhost:3000/api/employee/update/${editingEmployee._id}`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setEmployees(employees.map(emp => emp._id === editingEmployee._id ? { ...emp, ...formData } : emp));
      setEditingEmployee(null);
    } catch (err) {
      setError('Failed to update employee');
    }
  };

  return (
    <div className="employee-list-container">
      <NavBar onLogout={handleLogout} />
      <div className="employee-list-content">
        <h1>Employee List</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
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
                  <tr key={emp._id}>
                    <td>{emp.Name}</td>
                    <td>{emp.Email}</td>
                    <td>{emp.Mobile}</td>
                    <td>{emp.Designation}</td>
                    <td>{emp.Gender}</td>
                    <td>{emp.Course}</td>
                    <td>
                      <button onClick={() => handleEditClick(emp)}>Edit</button>
                      <button onClick={() => handleDeleteClick(emp._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {editingEmployee && (
          <div className="edit-form-container">
            <h2>Edit Employee</h2>
            <form onSubmit={handleSubmit}>
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

              <label>Gender</label>
              <div>
                <label>
                  <input type="radio" name="Gender" value="Male" checked={formData.Gender === 'Male'} onChange={handleFormChange} />
                  Male
                </label>
                <label>
                  <input type="radio" name="Gender" value="Female" checked={formData.Gender === 'Female'} onChange={handleFormChange} />
                  Female
                </label>
              </div>

              <label>Course</label>
              <div>
                <label>
                  <input type="checkbox" name="Course" value="MCA" checked={formData.Course.includes('MCA')} onChange={handleFormChange} />
                  MCA
                </label>
                <label>
                  <input type="checkbox" name="Course" value="BCA" checked={formData.Course.includes('BCA')} onChange={handleFormChange} />
                  BCA
                </label>
                <label>
                  <input type="checkbox" name="Course" value="BSC" checked={formData.Course.includes('BSC')} onChange={handleFormChange} />
                  BSC
                </label>
              </div>

              <label>Img Upload</label>
              <input type="file" name="Img" onChange={handleFormChange} />

              <button type="submit">Submit</button>
              <button type="button" onClick={() => setEditingEmployee(null)}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
