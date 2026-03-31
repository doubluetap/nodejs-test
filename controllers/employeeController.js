const db = require("../config/db");

// CHECK ROLE
function checkRole(req) {
    return req.session.user &&
        (req.session.user.role === "admin" || req.session.user.role === "hr");
}

// ================= GET =================
exports.getEmployees = (req, res) => {
    if (!checkRole(req)) return res.send("forbidden");

    const sql = `
        SELECT e.*, u.username 
        FROM employees e
        LEFT JOIN users u ON e.user_id = u.id
    `;

    db.query(sql, (err, data) => {
        if (err) return res.send(err);
        res.json(data);
    });
};

// ================= ADD =================
exports.addEmployee = (req, res) => {
    if (!checkRole(req)) return res.send("forbidden");

    const { name, position, salary, user_id } = req.body;

    db.query(
        "INSERT INTO employees (name, position, salary, user_id) VALUES (?, ?, ?, ?)",
        [name, position, salary, user_id],
        (err) => {
            if (err) {
                console.log(err);
                return res.send("❌ Lỗi thêm");
            }
            res.send("✅ Thêm thành công");
        }
    );
};

// ================= UPDATE =================
exports.updateEmployee = (req, res) => {
    if (!checkRole(req)) return res.send("forbidden");

    const { id, name, position, salary, user_id } = req.body;

    db.query(
        "UPDATE employees SET name=?, position=?, salary=?, user_id=? WHERE id=?",
        [name, position, salary, user_id, id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send("❌ Lỗi sửa");
            }

            if (result.affectedRows === 0) {
                return res.send("⚠️ Không tìm thấy nhân viên");
            }

            res.send("✅ Cập nhật thành công");
        }
    );
};

// ================= DELETE =================
exports.deleteEmployee = (req, res) => {
    if (!checkRole(req)) return res.send("forbidden");

    let { id } = req.body;
    id = parseInt(id);

    if (!id) {
        return res.send("❌ ID không hợp lệ");
    }

    db.query(
        "DELETE FROM employees WHERE id=?",
        [id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send("❌ Lỗi xóa");
            }

            if (result.affectedRows === 0) {
                return res.send("⚠️ Không tìm thấy nhân viên");
            }

            res.send("✅ Xóa thành công");
        }
    );
};