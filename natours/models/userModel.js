const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username cannot be null'],
  },
  email: {
    type: String,
    required: [true, 'Email cannot be null'],
    unique: true,
    lowercase: true, // this will convert the email into lowercase
    validate: [validator.isEmail, 'Email should be valid'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password cannot be null'],
    minlength: [8, 'Password must have atleast 8 characters'],
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm password cannot be null'],
    minlength: [8, 'Confirm password must have atleast 8 characters'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
