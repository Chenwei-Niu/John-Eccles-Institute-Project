// userRoutes.js

const express = require('express');
const { insertUser,fetchUserData,deleteUser } = require('../controllers/userController');

const router = express.Router();

router.post('/insert', insertUser);
router.post('/delete', deleteUser);
router.get('/data', fetchUserData);

module.exports = router;
