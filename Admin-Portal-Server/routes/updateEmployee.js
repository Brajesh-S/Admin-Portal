// routes/updateEmployee.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/employee_details');
const auth = require('../middleware/verifyToken');
const validateEmployee = require('../middleware/validateEmployee');

// Update Employee
router.put('/update/:id', auth, validateEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Email, Mobile, Designation, Gender, Course } = req.body;

    // Find employee by ID and update details
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { Name, Email, Mobile, Designation, Gender, Course },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.json({ msg: 'Employee updated successfully', employee: updatedEmployee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
