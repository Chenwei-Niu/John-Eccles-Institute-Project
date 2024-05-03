// presenterRoutes.js

const express = require('express');
const { fetchPresenterData, updatePresenter, deletePresenter, insertPresenter, fetchPresenterInterets} = require('../controllers/presenterController');

const router = express.Router();

router.get('/data', fetchPresenterData);
router.post('/update', updatePresenter);
router.post('/delete', deletePresenter);
router.post('/insert', insertPresenter);
router.post('/fetch-interests', fetchPresenterInterets);

module.exports = router;
