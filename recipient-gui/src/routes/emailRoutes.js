// userRoutes.js

const express = require('express');
const { generateEmail } = require('../controllers/emailController.js');

const router = express.Router();

router.post('/generate_verification_email', generateEmail);

module.exports = router;