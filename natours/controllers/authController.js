const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
