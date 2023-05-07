const asyncHandler = require('express-async-handler');

exports.user_sign_up = asyncHandler(async (req, res, next) => {
  res.render('sign-up-form', {
    title: 'Sign Up',
  });
});

exports.user_login = asyncHandler(async (req, res, next) => {
  res.send('Not implemented: User Login');
});
