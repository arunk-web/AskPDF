const express = require('express')
const {chatwithDocument,chatStreamWithDocument} = require('../controllers/chatController');

const router = express.Router()

router.post('/chat',chatwithDocument);
router.post('/chat/stream',chatStreamWithDocument);

module.exports = router;
