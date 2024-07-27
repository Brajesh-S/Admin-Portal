const express = require('express');
const router = express.Router();
const Employee = require('../models/employee_details');
const auth = require('../middleware/verifyToken');
const validateEmployee = require('../middleware/validateEmployee');

// Create Employee
router.post('/create', auth, validateEmployee, async (req, res) => {
  try {
    const { Name, Email, Mobile, Designation, Gender, Course } = req.body;
    
    // Create a new employee record
    const newEmployee = new Employee({
      Name,
      Email,
      Mobile,
      Designation,
      Gender,
      Course,
    });

    // Save the employee record to the database
    await newEmployee.save();

    res.status(201).json({ msg: 'Employee created successfully', employee: newEmployee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
