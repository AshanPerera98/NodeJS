const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// this function will filter the object for wanted fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'SUCCESS',
    requestTime: req.requestTime,
    resutls: users.length,
    data: {
      users,
    },
  });
});

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  // 1) Send an error if the user try to update the password using this route
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError('This endpoint doesnt suppord updating password!', 400)
    );
  }

  // 2) Filter out unwanted fields from request body
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update the user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // this will return the newly updated user as the result
    runValidators: true, // running user model validators
  });

  res.status(200).json({
    status: 'SUCCESS',
    data: {
      user: updatedUser,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'ERROR',
    message: 'This route is not yet implemented',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'ERROR',
    message: 'This route is not yet implemented',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'ERROR',
    message: 'This route is not yet implemented',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'ERROR',
    message: 'This route is not yet implemented',
  });
};
