const db = require("../config/db");

// CHECK LOGIN
function checkLogin(req) {
    return req.session.user;
}

// =======================
// GET TODAY
// =======================
exports.getToday = (req, res) => {
    if (!checkLogin(req)) return res.send("forbidden");

    const userId = req.session.user.id;

    db.query(
        "SELECT * FROM attendance WHERE employee_id=? AND date=CURDATE() ORDER BY check_in DESC",
        [userId],
        (err, data) => {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            res.json(data);
        }
    );
};

// =======================
// CHECK-IN
// =======================
exports.checkIn = (req, res) => {
    if (!checkLogin(req)) return res.send("forbidden");

    const userId = req.session.user.id;

    db.query(
        "SELECT id FROM employees WHERE user_id = ?",
        [userId],
        (err, result) => {

            if (err || result.length === 0) {
                return res.send("❌ Không tìm thấy employee");
            }

            const employeeId = result[0].id;

            db.query(
                "INSERT INTO attendance (employee_id, check_in, date) VALUES (?, NOW(), CURDATE())",
                [employeeId],
                (err) => {
                    if (err) return res.send("❌ Lỗi check-in");
                    res.send("✅ Check-in thành công");
                }
            );

        }
    );
};

// =======================
// CHECK-OUT
// =======================
exports.checkOut = (req, res) => {
    if (!checkLogin(req)) return res.send("forbidden");

    const userId = req.session.user.id;

    db.query(
        "SELECT id FROM employees WHERE user_id = ?",
        [userId],
        (err, result) => {

            if (err || result.length === 0) {
                return res.send("❌ Không tìm thấy employee");
            }

            const employeeId = result[0].id;

            db.query(
                `UPDATE attendance 
                 SET check_out = NOW() 
                 WHERE employee_id=? 
                 AND check_out IS NULL
                 ORDER BY check_in DESC 
                 LIMIT 1`,
                [employeeId],
                (err, result) => {
                    if (err) return res.send("❌ Lỗi check-out");
                    if (result.affectedRows === 0) {
                        return res.send("⚠️ Không có phiên check-in nào");
                    }
                    res.send("✅ Check-out thành công");
                }
            );
        }
    );
};
exports.getWorkDays = (req, res) => {
    if (!req.session.user) return res.send("forbidden");

    const userId = req.session.user.id;

    db.query(
        "SELECT id FROM employees WHERE user_id = ?",
        [userId],
        (err, result) => {

            if (err || result.length === 0) {
                return res.send({ workDays: 0 });
            }

            const employeeId = result[0].id;

            db.query(
                `SELECT COUNT(DISTINCT date) AS workDays
                 FROM attendance
                 WHERE employee_id = ?
                 AND MONTH(date) = MONTH(CURDATE())
                 AND YEAR(date) = YEAR(CURDATE())`,
                [employeeId],
                (err, data) => {
                    if (err) return res.send(err);
                    res.json(data[0]);
                }
            );

        }
    );
};
exports.getSummary = (req, res) => {
    const month = req.query.month || new Date().getMonth() + 1;
    const year = req.query.year || new Date().getFullYear();

    db.query(
        `
        SELECT 
            e.id,
            e.name,
            COUNT(DISTINCT a.date) AS work_days
        FROM employees e
        LEFT JOIN attendance a 
            ON e.id = a.employee_id
            AND MONTH(a.date) = ?
            AND YEAR(a.date) = ?
            AND a.check_in IS NOT NULL
            -- AND a.check_out IS NOT NULL  -- Bỏ nếu bạn muốn tính khi chỉ check-in
        GROUP BY e.id, e.name
        `,
        [month, year],
        (err, data) => {
            if (err) return res.send(err);
            res.json(data);
        }
    );
};