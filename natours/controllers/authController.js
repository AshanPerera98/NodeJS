const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TTL,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // only saving the mentioned feilds to the db so client cant sent anything (role) to db
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  // creating the JWT token
  const token = generateToken(user._id);

  res.status(201).json({
    status: 'SUCCESS',
    token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //   Check email and password is available
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //   Check if the user exists and password is correct
  const user = await User.findOne({ email }).select('+password'); // '+password' is used to get hidden fields

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Wrong username or password', 401));
  }

  const token = generateToken(user.id);

  res.status(200).json({
    status: 'SUCCESS',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Checking for the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('User is not logged in', 401));
  }

  // 2) Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // promisify will make jwt.verify return a promise rather than the callback
  console.log(decoded);

  // 3) Check if the user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError('User who own this token doesnt exist anymore', 401)
    );
  }

  // 4) Check if the password has changed after the tocken was issued
  // "iat" means issued at
  if (await user.passwordChanged(decoded.iat)) {
    return next(new AppError('User has changed the password recently', 401));
  }

  // Setting the authorized user as the user
  req.user = user;

  next();
});

// this "allow" function will return the async middleware immediately
exports.allow = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Do not have permission to perform this action', 403)
      );
    }

    next();
  });

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on emial
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user found with this email', 404));
  }

  // 2) Generate reset token
  const resetToken = user.createPasswordResetToken();
  // saving the user to update the db with reset token and expiration time
  await user.save({ validateBeforeSave: false }); // "validateBeforeSave" will remove the validation

  // 3) Send token to the email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `If you forgot your password send a PATCH request to the ${resetUrl} with new password and confirm password.\nIf you didnt forgot the password please ignore this email`;

  // try sending the email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token (Only valid for 10min)',
      message,
    });

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Rest token send via email',
    });
    // if an error occured reset the password reset token and expiration time
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Error sending the token via email. Please try again', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Gat the user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  // If user is available and token is valid change password
  if (!user) {
    return next(
      new AppError('Password reset token is invalid or expired', 400)
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  // Update the passwordChangedAt
  // Login the user and send JWT
  const token = generateToken(user.id);

  res.status(200).json({
    status: 'SUCCESS',
    token,
  });
});
