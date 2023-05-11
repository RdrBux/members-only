const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Members Only', user: req.user });
});

router.post('/log-in', userController.user_login);

router.get('/sign-up', userController.user_sign_up_get);

router.post('/sign-up', userController.user_sign_up_post);

router.get('/log-out', userController.user_logout);

module.exports = router;
