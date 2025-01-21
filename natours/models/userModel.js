const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { type } = require('os');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username cannot be null'],
    minlength: [8, 'Username must have atleast 8 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email cannot be null'],
    unique: true,
    lowercase: true, // this will convert the email into lowercase
    validate: [validator.isEmail, 'Email should be valid'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
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
  passwordResetToken: String,
  passwordResetExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Document middleware to do the password encryprtion
userSchema.pre('save', async function (next) {
  // if password hasnt changed in the document exit the function
  if (!this.isModified('password')) {
    return next();
  }

  //   encrypting the password using hash
  this.password = await bcrypt.hash(this.password, 12);

  //   removing confirmPassword field from saving to DB
  this.confirmPassword = undefined;
  next();
});

// Document middleware to update the "passwordChangedAt" property when there is a change to password
userSchema.pre('save', async function (next) {
  // bypass the update if passsword has not changed or if the document is a new doc
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000; // -1000ms will give a 1 second window to correct the db update time with the JWT token creation time
  next();
});

// Query middleware to filter inactive users out
userSchema.pre(/^find/, async function (next) {
  // points to the current query
  this.find({ active: { $ne: false } });
  next();
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

// instance method to create password rest token and expiration date
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex'); // generating random token

  // saving the encrypted reset token to the db
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // setting password reset window to 10 mins
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

  // returning the reset token
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
