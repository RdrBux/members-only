const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

exports.user_sign_up_get = asyncHandler(async (req, res, next) => {
  res.render('sign-up-form', {
    title: 'Sign Up',
  });
});

exports.user_sign_up_post = [
  body('fullname')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Username is too long. (Max 100 characters)')
    .escape(),

  body('username')
    .trim()
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail()
    .escape(),

  body('password')
    .trim()
    .isLength({ min: 8, max: 100 })
    .withMessage('Password must be between 8 and 100 characters'),

  body('repeat-password').custom(async (repeatPassword, { req }) => {
    const password = req.body.password;

    if (password != repeatPassword) {
      throw new Error('Passwords must be the same');
    }
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('sign-up-form', {
        title: 'Sign Up',
        errors: errors.array(),
      });
      return;
    }

    const userExists = await User.findOne({
      username: req.body.username,
    }).exec();
    if (userExists) {
      res.render('sign-up-form', {
        title: 'Sign Up',
        errors: ['The entered email is already in use'],
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      } else {
        const newUser = new User({
          fullname: req.body.fullname,
          username: req.body.username,
          password: hashedPassword,
          member: false,
        });
        await newUser.save();
        res.redirect('/');
      }
    });
  }),
];

exports.user_login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/b',
});

exports.user_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
