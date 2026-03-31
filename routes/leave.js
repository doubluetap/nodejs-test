const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");

// middleware check manager
function checkManager(req, res, next) {
    if (!req.session.user || 
        (req.session.user.role !== 'ql' && req.session.user.role !== 'hr')) {
        return res.status(403).send("Không có quyền");
    }
    next();
}

// NV tạo đơn
router.post("/", leaveController.createLeave);

// QL/HR xem danh sách chờ
router.get("/pending", checkManager, leaveController.getPendingLeaves);

// duyệt
router.post("/:id/approve", checkManager, leaveController.approveLeave);

// từ chối
router.post("/:id/reject", checkManager, leaveController.rejectLeave);

module.exports = router;