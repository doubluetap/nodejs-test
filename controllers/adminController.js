// controllers/adminController.js

const db = require('../config/db');

// =======================
// CHECK ADMIN
// =======================
exports.checkAdmin = (req, res) => {
    console.log("SESSION:", req.session.user);

    if (!req.session.user) {
        return res.send('no');
    }

    if (req.session.user.role !== 'admin') {
        return res.send('no');
    }

    res.send('ok');
};

// =======================
// LẤY DANH SÁCH USER
// =======================
exports.getUsers = (req, res) => {
    db.query('SELECT id, username, role FROM users', (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
};

// =======================
// UPDATE ROLE
// =======================
exports.updateRole = (req, res) => {
    const { username, role } = req.body;

    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.send('❌ Không có quyền');
    }

    db.query(
        'UPDATE users SET role = ? WHERE username = ?',
        [role, username],
        (err) => {
            if (err) return res.send('❌ Lỗi update');
            res.send('✅ Cập nhật thành công');
        }
    );
};