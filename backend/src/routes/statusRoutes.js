const express = require('express')
const jobStatus = require('../controllers/statusController');
const router = express.Router()

router.get('/status/:documentId', jobStatus);

module.exports = router;


