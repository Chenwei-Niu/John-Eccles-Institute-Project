// userRoutes.js

const express = require('express');
const { insertUser,fetchUserData,deleteUser, fetchInterets, updateUser, insertUserInBulk} = require('../controllers/userController');
const router = express.Router();

router.post('/insert', insertUser);
router.post('/delete', deleteUser);
router.post('/fetch-interests', fetchInterets);
router.post('/update', updateUser);
router.post('/bulk-add', insertUserInBulk);
router.get('/data', fetchUserData);

module.exports = router;
