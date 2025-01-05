const express = require("express");

const router = express.Router();
const { verifyToken, isManager } = require("../controllers/MiddleAuth");

const employeeController = require("../controllers/EmployeeController");

router.get(
  "/employees",
  verifyToken,
  isManager,
  employeeController.getEmployees
);

module.exports = router;
