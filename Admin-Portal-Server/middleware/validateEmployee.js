
const { body, validationResult } = require('express-validator');
const Employee = require('../models/employee_details');

// Middleware for employee validation
const validateEmployee = (skipDuplicateCheck = false) => [

  body('Email').isEmail().withMessage('Invalid email format'),


  body('Mobile').isNumeric().withMessage('Mobile must be numeric'),


  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { Email } = req.body;
    const { id } = req.params; 

    // Skip duplicate email check if `skipDuplicateCheck` is true
    if (!skipDuplicateCheck) {
      const existingEmployee = await Employee.findOne({ Email });
      if (existingEmployee && existingEmployee._id.toString() !== id) {
        return res.status(400).json({ msg: 'Email already exists' });
      }
    }

    next();
  }
];

module.exports = validateEmployee;
