const db = require("../config/db");

// ===== HELPER =====
function getEmployeeId(userId, callback) {
    db.query(
        "SELECT id FROM employees WHERE user_id = ?",
        [userId],
        (err, result) => {
            if (err || result.length === 0) return callback(null);
            callback(result[0].id);
        }
    );
}

// ===== CREATE =====
exports.createRequest = (req, res) => {
    const { date, start_time, end_time, reason } = req.body;
    const user = req.session.user;

    if (!user) return res.status(401).json({ message: "Chưa đăng nhập" });

    if (!date || !start_time || !end_time) {
        return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    if (start_time >= end_time) {
        return res.status(400).json({ message: "Giờ không hợp lệ" });
    }

    getEmployeeId(user.id, (employee_id) => {
        if (!employee_id) {
            return res.status(500).json({ message: "Không tìm thấy nhân viên" });
        }

        db.query(
            `INSERT INTO overtime (employee_id, date, start_time, end_time, reason)
             VALUES (?, ?, ?, ?, ?)`,
            [employee_id, date, start_time, end_time, reason],
            (err) => {
                if (err) return res.status(500).json({ message: "Lỗi DB" });

                res.json({ message: "Gửi yêu cầu thành công" });
            }
        );
    });
};

// ===== GET PENDING =====
exports.getPending = (req, res) => {
    const user = req.session.user;

    if (!user || !['ql', 'admin'].includes(user.role)) {
        return res.status(403).json({ message: "Không có quyền" });
    }

    db.query(`
        SELECT o.*, e.name 
        FROM overtime o
        JOIN employees e ON o.employee_id = e.id
        WHERE o.status = 'PENDING'
    `, (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi DB" });

        res.json(results);
    });
};

// ===== APPROVE =====
exports.approveRequest = (req, res) => {
    const user = req.session.user;
    const id = req.params.id;

    console.log("USER:", user);
    console.log("REQUEST ID:", id);

    if (!user || !['ql', 'admin'].includes(user.role)) {
        return res.status(403).json({ message: "Không có quyền" });
    }

    getEmployeeId(user.id, (manager_id) => {
        if (!manager_id) {
            return res.status(500).json({ message: "Không tìm thấy manager" });
        }

        db.query(
            `UPDATE overtime 
             SET status='APPROVED', manager_id=? 
             WHERE id=?`,
            [manager_id, id],
            (err, result) => {

                if (err) {
                    console.error("APPROVE ERROR:", err);
                    return res.status(500).json({ message: "Lỗi duyệt" });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Không tìm thấy request" });
                }

                res.json({ message: "Đã duyệt" });
            }
        );
    });
};

// ===== REJECT =====
exports.rejectRequest = (req, res) => {
    const user = req.session.user;
    const id = req.params.id;
    const { reason } = req.body;

    if (!user || !['ql', 'admin'].includes(user.role)) {
        return res.status(403).json({ message: "Không có quyền" });
    }

    getEmployeeId(user.id, (manager_id) => {
        if (!manager_id) {
            return res.status(500).json({ message: "Không tìm thấy manager" });
        }

        db.query(
            `UPDATE overtime 
             SET status='REJECTED', manager_id=?, reject_reason=? 
             WHERE id=?`,
            [manager_id, reason, id],
            (err) => {
            if (err) {
                console.error("REJECT ERROR:", err);
                return res.status(500).json({ message: "Lỗi duyệt" });
            }
                res.json({ message: "Đã từ chối" });
            }
        );
    });
};