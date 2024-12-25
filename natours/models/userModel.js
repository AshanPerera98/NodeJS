const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password cannot be null'],
    minlength: [8, 'Password must have atleast 8 characters'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm password cannot be null'],
    validate: {
      //   validator function to check the confirmPassword is equal to password
      //   This only works on CREATE and SAVE
      validator: function (pass) {
        return pass === this.password;
      },
      message: 'Passwords does not match!',
    },
  },
  passwordChangedAt: Date,
});

// Document middleware to do the password encryprtion
userSchema.pre('save', async function (next) {
  // if password hasnt changed in the document exit the function
  if (!this.isModified('password')) return next();

  //   encrypting the password using hash
  this.password = await bcrypt.hash(this.password, 12);

  //   removing confirmPassword field from saving to DB
  this.confirmPassword = undefined;
});

// export instance method password checking
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// export instance method password change checking
userSchema.methods.passwordChanged = async function (JWTTimestamp) {
  // In instance methods "this" keyword always point to the current document
  if (this.passwordChangedAt) {
    const changedTimestamp = Number(this.passwordChangedAt.getTime() / 1000); // converting the mongo db time to compare

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
