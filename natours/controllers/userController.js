const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const factory = require('./handlerFactory');

// this function will filter the object for wanted fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// middleware to set the user id to logged in user id
exports.getCurrentUser = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

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

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(201).json({
    status: 'SUCCESS',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'ERROR',
    message: 'This route is not implemented. Please use signup',
  });
};

exports.getAllUsers = factory.readAllDocumnets(User);
exports.getUser = factory.readDocumnet(User);
exports.updateUser = factory.updateDocument(User);
exports.deleteUser = factory.deleteDocument(User);
