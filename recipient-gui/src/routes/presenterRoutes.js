// userRoutes.js

const express = require('express');
const { fetchPresenterData, updatePresenter, deletePresenter, insertPresenter} = require('../controllers/presenterController');

const router = express.Router();

router.get('/data', fetchPresenterData);
router.post('/update', updatePresenter);
router.post('/delete', deletePresenter);
router.post('/insert', insertPresenter);

module.exports = router;
