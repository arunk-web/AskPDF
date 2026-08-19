const upload = require('../middleware/upload')
const express = require('express')
const uploadDocument = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload', upload.single('pdf'), uploadDocument);


module.exports = router;