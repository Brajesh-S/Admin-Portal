const { body, validationResult } = require('express-validator');
const Employee = require('../models/employee_details');


// Middleware for employee validation
const validateEmployee = [
  // Check if Email is valid
  body('Email').isEmail().withMessage('Invalid email format'),

  // Check if Mobile is numeric
  body('Mobile').isNumeric().withMessage('Mobile must be numeric'),

  // Check for duplicate Email
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { Email } = req.body;
    const existingEmployee = await Employee.findOne({ Email });

    if (existingEmployee) {
      return res.status(400).json({ msg: 'Email already exists' });
    }
    next();
  }
];

module.exports = validateEmployee;
