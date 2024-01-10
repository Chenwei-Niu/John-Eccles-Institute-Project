// userRoutes.js

const express = require('express');
const { insertUser,fetchUserData } = require('../controllers/userController');

const router = express.Router();

router.post('/insert', insertUser);
router.get('/data', fetchUserData);

module.exports = router;
