// routes/searchEmployee.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/employee_details');
const auth = require('../middleware/verifyToken');

// Search Employee by Name
router.get('/search', auth, async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Name query parameter is required' });
  }

  try {
    const employees = await Employee.find({ Name: new RegExp(name, 'i') }); // Case-insensitive search
    res.json({ employees });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
