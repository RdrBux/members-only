const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Post = require('../models/postModel');

exports.index = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({})
    .sort({ createdAt: 'desc' })
    .populate('user')
    .exec();

  const alert = req.session.messages;
  req.session.messages = null;
  res.render('index', {
    title: 'Members Only',
    posts,
    alert,
  });
});

exports.new_message_get = asyncHandler(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  }
  console.log(req.user);
  res.render('message-form', { title: 'Add a new message' });
});

exports.new_message_post = [
  body('title', 'Must add a title').trim().isLength({ min: 1 }).escape(),

  body('content', 'Must add a message').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('message-form', {
        title: 'Add a new message',
        errors: errors.array(),
      });
      return;
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      user: req.user._id,
    });

    await newPost.save();
    res.redirect('/');
  }),
];

exports.remove_post_get = asyncHandler(async (req, res, next) => {
  if (!req.user?.admin) {
    res.redirect('/');
  }

  const post = await Post.findById(req.params.id).exec();

  if (!post) {
    res.redirect('/');
  }

  res.render('post_remove_form', {
    title: `Remove message: ${post.title}`,
    post,
  });
});

exports.remove_post_post = asyncHandler(async (req, res, next) => {
  if (!req.user?.admin) {
    res.redirect('/');
  }

  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/');
});
