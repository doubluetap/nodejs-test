const express = require("express");
const router = express.Router();
const controller = require("../controllers/attendanceController");

router.get("/today", controller.getToday);
router.post("/checkin", controller.checkIn);
router.post("/checkout", controller.checkOut);
router.get('/workdays', controller.getWorkDays);
router.get('/summary', controller.getSummary);

module.exports = router;