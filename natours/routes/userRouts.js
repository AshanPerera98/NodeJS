const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.get(
  '/getCurrentUser',
  authController.protect,
  userController.getCurrentUser,
  userController.getUser
);

router.patch(
  '/updateCurrentUser',
  authController.protect,
  userController.updateCurrentUser
);
router.delete(
  '/deleteCurrentUser',
  authController.protect,
  userController.deleteCurrentUser
);

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
