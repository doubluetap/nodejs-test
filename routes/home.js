const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// API lấy user
router.get('/api/user', homeController.getUser);

// Route admin (có check quyền)
router.get('/admin', homeController.checkAdmin, homeController.adminPage);

module.exports = router;