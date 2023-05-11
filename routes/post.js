const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

router.get('/message-form', postController.new_message_get);

router.post('/message-form', postController.new_message_post);

module.exports = router;
