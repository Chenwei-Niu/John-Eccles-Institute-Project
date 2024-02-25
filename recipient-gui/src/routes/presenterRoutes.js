// userRoutes.js

const express = require('express');
const { fetchPresenterData, updatePresenter, deletePresenter} = require('../controllers/presenterController');

const router = express.Router();

router.get('/data', fetchPresenterData);
router.post('/update', updatePresenter);
router.post('/delete', deletePresenter);

module.exports = router;
