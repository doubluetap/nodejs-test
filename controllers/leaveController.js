const db = require("../config/db"); // dùng chung file db của bạn

// tạo đơn
exports.createLeave = async (req, res) => {
    try {
        // 🔥 check login trước
        if (!req.session.user) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }

        const { type, startDate, endDate, reason } = req.body;

        const userId = req.session.user.id;

        // 🔥 check input
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Thiếu ngày" });
        }

        // lấy employee
        const [emp] = await db.query(
            "SELECT id FROM employees WHERE user_id = ?",
            [userId]
        );

        if (emp.length === 0) {
            return res.status(400).json({ message: "Không có employee" });
        }

        const employee_id = emp[0].id;

        await db.query(
            `INSERT INTO leaves 
            (employee_id, type, start_date, end_date, reason) 
            VALUES (?, ?, ?, ?, ?)`,
            [employee_id, type, startDate, endDate, reason]
        );

        res.json({ message: "OK" });

    } catch (err) {
        console.log("🔥 ERROR CREATE LEAVE:", err); // 👈 QUAN TRỌNG
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// lấy danh sách chờ
exports.getPendingLeaves = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.*, e.name 
            FROM leaves l
            JOIN employees e ON l.employee_id = e.id
            WHERE l.status = 'PENDING'
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).send("Lỗi server");
    }
};

// duyệt
exports.approveLeave = async (req, res) => {
    try {
        const id = req.params.id;
        const manager_id = req.session.user.id;

        await db.query(
            "UPDATE leaves SET status='APPROVED', manager_id=? WHERE id=?",
            [manager_id, id]
        );

        res.json({ message: "Đã duyệt" });

    } catch (err) {
        res.status(500).send("Lỗi server");
    }
};

// từ chối
exports.rejectLeave = async (req, res) => {
    try {
        const id = req.params.id;
        const { reasonReject } = req.body;

        await db.query(
            "UPDATE leaves SET status='REJECTED', reject_reason=? WHERE id=?",
            [reasonReject, id]
        );

        res.json({ message: "Đã từ chối" });

    } catch (err) {
        res.status(500).send("Lỗi server");
    }
};