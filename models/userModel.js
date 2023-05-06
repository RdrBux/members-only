const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    maxLength: 100,
  },
  email: {
    type: String,
    required: true,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    maxLength: 100,
  },
  member: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
