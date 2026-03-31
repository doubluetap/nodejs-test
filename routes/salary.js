const express = require("express");
const router = express.Router();

const salaryController = require("../controllers/salaryController");

// 👉 API tính lương
router.post("/calculate", salaryController.calculateSalary);

module.exports = router;