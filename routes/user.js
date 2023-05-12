const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', postController.index);

router.post('/log-in', userController.user_login);

router.get('/sign-up', userController.user_sign_up_get);

router.post('/sign-up', userController.user_sign_up_post);

router.get('/log-out', userController.user_logout);

router.get('/member-form', userController.member_form_get);

router.post('/member-form', userController.member_form_post);

module.exports = router;
