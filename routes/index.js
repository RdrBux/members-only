const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Members Only' });
});

router.get('/login', userController.user_login);

router.get('/sign-up', userController.user_sign_up);

module.exports = router;
