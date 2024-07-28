// // index.js
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Employee = require("./models/employee_details"); // Adjust the path as necessary
const auth = require("./middleware/verifyToken");
const employeeRoutes = require("./routes/employee");
const createEmployeeRoutes = require("./routes/createEmployee");
const updateEmployeeRoutes = require("./routes/updateEmployee");
const searchEmployeeRoutes = require("./routes/searchEmployee");
const deleteEmployeeRoutes = require("./routes/deleteEmployee");
const authRoutes = require("./routes/auth");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3001"],
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

const employees = [
  {
    Name: "hukum",
    Email: "hcgupta@cstech.in",
    Mobile: "954010044",
    Designation: "HR",
    Gender: "Male",
    Course: "MCA",
  },
  {
    Name: "manish",
    Email: "manish@cstech.in",
    Mobile: "954010033",
    Designation: "Sales",
    Gender: "Male",
    Course: "BCA",
  },
  {
    Name: "yash",
    Email: "yash@cstech.in",
    Mobile: "954010022",
    Designation: "Manager",
    Gender: "Male",
    Course: "BSC",
  },
  {
    Name: "abhishek",
    Email: "abhishek@cstech.in",
    Mobile: "954010033",
    Designation: "HR",
    Gender: "Male",
    Course: "MCA",
  },
];

async function insertEmployees() {
  try {
    for (const employee of employees) {
      await Employee.updateOne(
        { Email: employee.Email }, // Check for an existing entry by email
        { $setOnInsert: employee }, // Insert only if no document matches
        { upsert: true } // Perform upsert
      );
    }
    console.log("Employees inserted/updated successfully");
  } catch (err) {
    console.error("Error inserting/updating employees:", err);
  }
}

mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("DB connection successful");

    // Insert or update employees in the database
    await insertEmployees();

    app.use("/api/protected", auth, (req, res) => {
      res.send("This is a protected route");
    });
    app.use("/api/auth", authRoutes);
    app.use("/api/employee", employeeRoutes);
    app.use("/api/createEmployee", createEmployeeRoutes);
    app.use("/api/updateEmployee", updateEmployeeRoutes);
    app.use("/api/searchEmployee", searchEmployeeRoutes);
    app.use("/api/deleteEmployee", deleteEmployeeRoutes);
    app.use("/uploads", express.static("uploads"));

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
