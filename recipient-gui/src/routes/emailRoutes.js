// userRoutes.js

const express = require('express');
const { generateEmail,sendEmail } = require('../controllers/emailController.js');

const router = express.Router();

router.post('/generate_verification_email', generateEmail);
router.post('/send_email', sendEmail);

module.exports = router;