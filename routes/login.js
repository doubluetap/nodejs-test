const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// hiển thị trang login
router.get("/", (req,res)=>{
    res.sendFile(require("path").join(__dirname,"../views/login.html"));
});

// xử lý đăng nhập
router.post("/", loginController.login);

module.exports = router;