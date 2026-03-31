const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeController");

router.get("/", controller.getEmployees);
router.post("/add", controller.addEmployee);
router.post("/update", controller.updateEmployee);
router.post("/delete", controller.deleteEmployee);

router.get("/check", (req, res) => {
    if (!req.session.user) return res.send("fail");

    const role = req.session.user.role;

    if (role === "admin" || role === "hr") {
        return res.send("ok");
    }

    res.send("fail");
});

module.exports = router;