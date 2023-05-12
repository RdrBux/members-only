const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    maxLength: 100,
  },
  username: {
    type: String,
    required: true,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
  },
  member: {
    type: Boolean,
    required: true,
  },
  admin: {
    type: Boolean,
  },
});

module.exports = mongoose.model('User', UserSchema);
