// eventRoutes.js

const express = require('express');
const { fetchEventData, updateEvent, deleteEvent, insertEvent} = require('../controllers/eventController');

const router = express.Router();

router.get('/data', fetchEventData);
router.post('/update', updateEvent);
router.post('/delete', deleteEvent);
router.post('/insert', insertEvent);

module.exports = router;
