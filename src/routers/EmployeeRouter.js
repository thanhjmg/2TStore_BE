const express = require("express");

const router = express.Router();
const {
  verifyToken,
  isEmployee,
  isManager,
} = require("../controllers/MiddleAuth");

const employeeController = require("../controllers/EmployeeController");

router.get(
  "/employees",
  verifyToken,
  isEmployee,
  employeeController.getEmployees
);

router.get(
  "/employeeById/:id",
  verifyToken,
  isEmployee,
  employeeController.getEmployeeById
);

router.put(
  "/updateEmployeeById/:id",
  verifyToken,
  isManager,
  employeeController.updateEmployeeById
);

router.post(
  "/addEmployee",
  verifyToken,
  isManager,
  employeeController.addEmployee
);

module.exports = router;
