// middleware kiểm tra đăng nhập (giả lập)
exports.getUser = (req, res) => {
    // Sau này lấy từ session/JWT
    const user = {
        username: "tampham",
        role: "hr" // thử đổi admin / hr / ql / nv
    };

    res.json(user);
};

// middleware phân quyền ADMIN
exports.checkAdmin = (req, res, next) => {
    const user = {
        username: "tampham",
        role: "hr" // đổi admin để test
    };

    if (user.role !== 'admin') {
        return res.send('Access denied: Admin only');
    }

    next();
};

// trang phân quyền
exports.adminPage = (req, res) => {
    res.send('Welcome to Admin Permission Page');
};