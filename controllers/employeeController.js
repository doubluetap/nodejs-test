const db = require("../config/db");

// =======================
// CHECK ROLE (admin + hr)
// =======================
function checkRole(req, res) {
    if (!req.session.user || 
       (req.session.user.role !== 'admin' && req.session.user.role !== 'hr')) {
        return false;
    }
    return true;
}

// =======================
// GET ALL
// =======================
exports.getEmployees = (req, res) => {
    if (!checkRole(req, res)) return res.send("forbidden");

    db.query("SELECT * FROM employees", (err, data) => {
        if (err) return res.send(err);
        res.json(data);
    });
};

// =======================
// ADD
// =======================
exports.addEmployee = (req, res) => {
    if (!checkRole(req, res)) return res.send("forbidden");

    const { name, position, salary } = req.body;

    db.query(
        "INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)",
        [name, position, salary],
        (err) => {
            if (err) return res.send("❌ Lỗi thêm");
            res.send("✅ Thêm thành công");
        }
    );
};

// =======================
// UPDATE
// =======================
exports.updateEmployee = (req, res) => {
    if (!checkRole(req, res)) return res.send("forbidden");

    const { id, name, position, salary } = req.body;

    db.query(
        "UPDATE employees SET name=?, position=?, salary=? WHERE id=?",
        [name, position, salary, id],
        (err) => {
            if (err) return res.send("❌ Lỗi sửa");
            res.send("✅ Cập nhật thành công");
        }
    );
};

// =======================
// DELETE
// =======================
exports.deleteEmployee = (req, res) => {
    if (!checkRole(req, res)) return res.send("forbidden");

    const { id } = req.body;

    db.query(
        "DELETE FROM employees WHERE id=?",
        [id],
        (err) => {
            if (err) return res.send("❌ Lỗi xóa");
            res.send("✅ Xóa thành công");
        }
    );
    function checkRole(req) {
    return req.session.user &&
           (req.session.user.role === 'admin' || req.session.user.role === 'hr');
}
};