require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const compression = require('compression');
const helmet = require('helmet');

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

const User = require('./models/userModel');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// Compression and Helmet
app.use(compression());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': [
        "'self'",
        'code.jquery.com',
        'cdn.jsdelivr.net',
        "'unsafe-inline'",
      ],
    },
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for users sessions
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
  })
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        // passwords match! log user in
        return done(null, user);
      } else {
        // passwords do not match!
        return done(null, false, { message: 'Incorrect password' });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Add user to locals
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// Routers
app.use('/', postRouter);
app.use('/', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
