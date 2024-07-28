// const express = require('express');
// const router = express.Router();
// const Employee = require('../models/employee_details');
// const auth = require('../middleware/verifyToken');

// // Fetch Employee Details
// router.get('/details',auth, async (req, res) => {
//   try {
//     const employees = await Employee.find({}, {
//       _id: 1, 
//       Image: 1, 
//       Name: 1, 
//       Email: 1, 
//       Mobile: 1, 
//       Designation: 1, 
//       Gender: 1, 
//       Course: 1, 
//       Createdate: 1
//     }).sort({ Name: 1 }).lean().exec();

//     // Rename _id to UniqueId
//     const formattedEmployees = employees.map(employee => ({
//       UniqueId: employee._id,
//       Image: employee.Image,
//       Name: employee.Name,
//       Email: employee.Email,
//       Mobile: employee.Mobile,
//       Designation: employee.Designation,
//       Gender: employee.Gender,
//       Course: employee.Course,
//       Createdate: employee.Createdate
//     }));

//     res.json(formattedEmployees);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Employee = require('../models/employee_details');
const auth = require('../middleware/verifyToken');

// Fetch Employee Details
router.get('/details', auth, async (req, res) => {
  try {
    const employees = await Employee.find({}, {
      _id: 1, 
      Image: 1, 
      Name: 1, 
      Email: 1, 
      Mobile: 1, 
      Designation: 1, 
      Gender: 1, 
      Course: 1, 
      Createdate: 1
    }).sort({ Name: 1 }).lean().exec();

    // Rename _id to UniqueId
    const formattedEmployees = employees.map(employee => ({
      UniqueId: employee._id,
      Image: employee.Image,
      Name: employee.Name,
      Email: employee.Email,
      Mobile: employee.Mobile,
      Designation: employee.Designation,
      Gender: employee.Gender,
      Course: employee.Course,
      Createdate: employee.Createdate
    }));

    res.json(formattedEmployees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

module.exports = router;
