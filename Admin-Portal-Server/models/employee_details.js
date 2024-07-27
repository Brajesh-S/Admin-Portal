const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  Image: {
    type: Buffer, 
    required: false,
  },
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Mobile: {
    type: String,
    required: true,
  },
  Designation: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  Course: {
    type: String,
    required: true,
  },
  Createdate: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model('Employee', EmployeeSchema, 'Employee_Details');
module.exports = Employee;
