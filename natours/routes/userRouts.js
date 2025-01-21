const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);

// this will run the protected route as a middleware so every route after this is protected
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.get(
  '/getCurrentUser',
  userController.getCurrentUser,
  userController.getUser
);

router.patch(
  '/updateCurrentUser',
  userController.uploadPhoto, // uploading a single image
  userController.resizePhoto, // resizing the uploaded photo
  userController.updateCurrentUser
);
router.delete('/deleteCurrentUser', userController.deleteCurrentUser);

// this will as a middleware so only admins can access below routes
router.use(authController.allow('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
