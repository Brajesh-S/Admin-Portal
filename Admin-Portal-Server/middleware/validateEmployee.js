const { body, validationResult } = require("express-validator");
const Employee = require("../models/employee_details");

// Middleware for employee validation
const validateEmployee = (skipDuplicateCheck = false) => [
  body("Email").isEmail().withMessage("Invalid email format"),

  body("Mobile").isNumeric().withMessage("Mobile must be numeric"),

  async (req, res, next) => {
    console.log("Incoming request body:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Incoming request body:", req.body);
      return res.status(400).json({ errors: errors.array() });
    }

    const { Email } = req.body;
    const { id } = req.params;

    // Skip duplicate email check if `skipDuplicateCheck` is true
    if (!skipDuplicateCheck) {
      try {
        const existingEmployee = await Employee.findOne({ Email });
        if (existingEmployee && existingEmployee._id.toString() !== id) {
          // Log when an existing email is found
          console.log("Existing employee found:", existingEmployee);
          return res.status(400).json({ msg: "Email already exists" });
        }
      } catch (err) {
        // Log database errors
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }
    }

    next();
  },
];

module.exports = validateEmployee;
