const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/overtimeController");

router.post("/", ctrl.createRequest);
router.get("/pending", ctrl.getPending);
router.put("/:id/approve", ctrl.approveRequest);
router.put("/:id/reject", ctrl.rejectRequest);

module.exports = router;