const multer = require('multer');
const sharp = require('sharp');
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

// configuring the multer disk storage with location and file name for the images
// const multerStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'public/img/users');
//   },
//   filename: (req, file, callback) => {
//     const ext = file.mimetype.split('/')[1];
//     callback(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// configuring the multer memory storage (buffer)
const multerStorage = multer.memoryStorage();

// filter to check if the uploaded file is an image in multer
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('Uploded file type is not supported!', 400), false);
  }
};

// multer config for uploading images
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// middleware for image uploading
exports.uploadPhoto = upload.single('photo');

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // resizing the uploaded image
  await sharp(req.file.buffer) // provide the image from the memory
    .resize(500, 500) // resolution
    .toFormat('jpeg') // file format
    .jpeg({ quality: 90 }) // quality
    .toFile(`public/img/users/${req.file.filename}`); // location and file name to save

  next();
});

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

  // if the image is uploaded update the photo field in the user db with new file name
  if (req.file) filteredBody.photo = req.file.filename;

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
