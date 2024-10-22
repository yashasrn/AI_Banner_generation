const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/BannerController');
const UserController = require('../controllers/UserController');

// API routes
router.post('/banners', BannerController.createBanner);
router.post('/users/login', UserController.login);
router.post('/users/signup', UserController.signup);

module.exports = router;
