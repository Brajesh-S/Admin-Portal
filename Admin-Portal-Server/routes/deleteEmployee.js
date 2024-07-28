// routes/deleteEmployee.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Employee = require("../models/employee_details");
const auth = require("../middleware/verifyToken");

// Delete Employee by ID
router.delete("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;

  // Check if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid employee ID" });
  }

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.json({ msg: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
