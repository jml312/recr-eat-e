const { Router } = require("express");
const {
  validateLoginInput,
  validateRegisterInput,
  checkForProfanity,
  validateHuman,
} = require("../middleware/auth.mw.js");
const {
  login,
  register,
  googleAuth,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller.js");

const router = Router();

// @route POST users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", [validateHuman, validateLoginInput], login);

// @route POST users/register
// @desc Register user
// @access Public
router.post(
  "/register",
  [validateHuman, validateRegisterInput, checkForProfanity],
  register
);

// @route POST users/googleauth
// @desc Check if user has created an account with google or not
// @access Public
router.post("/googleauth", validateHuman, googleAuth);

// @route POST users/forgotpassword
// @desc Send password reset link to user
// @access Public
router.post("/forgotpassword", validateHuman, forgotPassword);

// @route PATCH users/resetpassword/:resetToken
// @desc Send JWT token to user
// @access Public
router.patch("/resetpassword/:resetToken", validateHuman, resetPassword);

module.exports = router;
