// const express = require('express');
// const router = express.Router();
// const Employee = require('../models/employee_details');
// const auth = require('../middleware/verifyToken');
// const validateEmployee = require('../middleware/validateEmployee');

// // Create Employee
// router.post('/create', auth, validateEmployee, async (req, res) => {
//   try {
//     const { Name, Email, Mobile, Designation, Gender, Course } = req.body;
    
//     // Create a new employee record
//     const newEmployee = new Employee({
//       Name,
//       Email,
//       Mobile,
//       Designation,
//       Gender,
//       Course,
//     });

//     // Save the employee record to the database
//     await newEmployee.save();

//     res.status(201).json({ msg: 'Employee created successfully', employee: newEmployee });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Employee = require('../models/employee_details');
const auth = require('../middleware/verifyToken');
const validateEmployee = require('../middleware/validateEmployee');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const ensureUploadsDirectoryExists = () => {
  const dir = 'uploads/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Call the function to ensure the directory exists
ensureUploadsDirectoryExists();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create Employee
router.post('/create', auth, upload.single('ImgUpload'), validateEmployee, async (req, res) => {
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

    // If an image is uploaded, set the image path
    if (req.file) {
      newEmployee.ImgUpload = req.file.path;
    }

    // Save the employee record to the database
    await newEmployee.save();

    res.status(201).json({ msg: 'Employee created successfully', employee: newEmployee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
