

// // routes/updateEmployee.js
// const express = require('express');
// const router = express.Router();
// const Employee = require('../models/employee_details');
// const auth = require('../middleware/verifyToken');
// const validateEmployee = require('../middleware/validateEmployee');
// const multer = require('multer');
// const bodyParser = require('body-parser');
// const path = require('path');
// const fs = require('fs');

// // Ensure uploads directory exists
// const ensureUploadsDirectoryExists = () => {
//   const dir = 'uploads/';
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // Call the function to ensure the directory exists
// ensureUploadsDirectoryExists();

// // Configure multer for file storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });
// router.use(bodyParser.json());

// // Update Employee
// router.put('/update/:id', auth, upload.single('ImgUpload'), validateEmployee, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { Name, Email, Mobile, Designation, Gender, Course } = req.body;

//     // Find employee by ID and update details
//     const updatedEmployee = await Employee.findByIdAndUpdate(
//       id,
//       { Name, Email, Mobile, Designation, Gender, Course },
//       { new: true, runValidators: true }
//     );

//     if (!updatedEmployee) {
//       return res.status(404).json({ msg: 'Employee not found' });
//     }

//     // If an image is uploaded, update the employee record with the image path
//     if (req.file) {
//       updatedEmployee.ImgUpload = req.file.path;
//       await updatedEmployee.save();
//     }

//     res.json({ msg: 'Employee updated successfully', employee: updatedEmployee });
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
const bodyParser = require('body-parser');
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
router.use(bodyParser.json());

// Update Employee
router.put('/update/:id', auth, upload.single('ImgUpload'), validateEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Email, Mobile, Designation, Gender, Course } = req.body;

    // Find the current employee details
    const currentEmployee = await Employee.findById(id);
    if (!currentEmployee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    // Check if the email is changing
    if (currentEmployee.Email !== Email) {
      // Check if the new email already exists
      const existingEmployee = await Employee.findOne({ Email });
      if (existingEmployee) {
        return res.status(400).json({ msg: 'Email already exists' });
      }
    }

    // Update employee details
    currentEmployee.Name = Name;
    currentEmployee.Email = Email;
    currentEmployee.Mobile = Mobile;
    currentEmployee.Designation = Designation;
    currentEmployee.Gender = Gender;
    currentEmployee.Course = Course;

    // If an image is uploaded, update the employee record with the image path
    if (req.file) {
      currentEmployee.ImgUpload = req.file.path;
    }

    // Save the updated employee details
    await currentEmployee.save();

    res.json({ msg: 'Employee updated successfully', employee: currentEmployee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
