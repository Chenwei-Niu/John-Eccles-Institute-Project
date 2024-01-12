// userRoutes.js

const express = require('express');
const { insertUser,fetchUserData,deleteUser, fetchInterets} = require('../controllers/userController');

const router = express.Router();

router.post('/insert', insertUser);
router.post('/delete', deleteUser);
router.post('/fetch-interests', fetchInterets)
router.get('/data', fetchUserData);

module.exports = router;
