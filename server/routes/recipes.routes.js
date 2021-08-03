const { verifyAuthorization } = require("../middleware/user.mw.js");
const {
  validateRecipe,
  checkForProfanity,
} = require("../middleware/recipes.mw.js");
const {
  getAllRecipes,
  getTop3Recipes,
  getUserRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  handleLike,
  getUserLikedRecipes,
} = require("../controllers/recipes.controller.js");
const { Router } = require("express");

const router = Router();

// @route GET recipes/all
// @desc Get all recipes
// @access Private
router.get("/all", verifyAuthorization, getAllRecipes);

// @route GET recipes/top3
// @desc Get top 3 recipes
// @access Private
router.get("/top3", verifyAuthorization, getTop3Recipes);

// @route GET recipes/user
// @desc Get all recipes from user
// @access Private
router.get("/user", verifyAuthorization, getUserRecipes);

// @route GET recipes/likes
// @desc Get all liked recipes from user
// @access Private
router.get("/likes", verifyAuthorization, getUserLikedRecipes);

// @route GET recipes/:recipeId
// @desc Get all recipe by id
// @access Private
router.get("/recipe/:recipeId", verifyAuthorization, getRecipeById);

// @route POST recipes/create
// @desc Create a recipe for a user
// @access Private
router.post(
  "/create",
  [verifyAuthorization, validateRecipe, checkForProfanity],
  createRecipe
);

// @route PUT recipes/update/:recipeId
// @desc Update a recipe for a user
// @access Private
router.put(
  "/update/:recipeId",
  [verifyAuthorization, checkForProfanity],
  updateRecipe
);

// @route DELETE recipes/delete/:recipeId
// @desc Delete a recipe for a user
// @access Private
router.delete("/delete/:recipeId", verifyAuthorization, deleteRecipe);

// @route PATCH recipes/like/:recipeId
// @desc Handle a like for a recipe
// @access Private
router.patch("/like/:recipeId", verifyAuthorization, handleLike);

module.exports = router;
