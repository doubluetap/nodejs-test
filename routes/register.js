const express = require("express");
const router = express.Router();

const registerController = require("../controllers/registerController");

router.get("/", (req,res)=>{
    res.sendFile(require("path").join(__dirname,"../views/register.html"));
});


router.post("/", registerController.register);

module.exports = router;