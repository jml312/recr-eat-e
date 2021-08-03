const {
  verifyAuthorization,
  validateUsername,
} = require("../middleware/user.mw.js");
const {
  getCurrentUser,
  getUserByUsername,
  clearNotifications,
  updateAccount,
  handleFollow,
  deleteRecipes,
  deleteLikes,
  deleteAccount,
} = require("../controllers/user.controller.js");
const { Router } = require("express");

const router = Router();

// @route GET user/me
// @desc get logged in user
// @access Private
router.get("/me", verifyAuthorization, getCurrentUser);

// @route GET user/:username
// @desc get user by username
// @access Private
router.get("/:username", verifyAuthorization, getUserByUsername);

// @route PATCH user/update
// @desc Update user info and recipe username
// @access Private
router.patch("/update", [verifyAuthorization, validateUsername], updateAccount);

// @route POST user/follow
// @desc Handle follow for a user
// @access Private
router.patch("/follow", verifyAuthorization, handleFollow);

// @route POST user/notifications
// @desc Clear notifications for a user
// @access Private
router.patch("/notifications", verifyAuthorization, clearNotifications);

// @route DELETE user/delete-recipes
// @desc Delete all recipes for a user
// @access Private
router.delete("/delete-recipes", verifyAuthorization, deleteRecipes);

// @route DELETE user/delete-likes
// @desc Delete all likes for a user
// @access Private
router.delete("/delete-likes", verifyAuthorization, deleteLikes);

// @route DELETE user/delete
// @desc Delete user account
// @access Private
router.delete("/delete-account", verifyAuthorization, deleteAccount);

module.exports = router;
