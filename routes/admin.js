// routes/admin.js

const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

// =======================
// ROUTES
// =======================

// check quyền admin
router.get('/check', adminController.checkAdmin);

// lấy danh sách user
router.get('/users', adminController.getUsers);

// cập nhật role
router.post('/update', adminController.updateRole);

module.exports = router;