const Recipe = require("../models/Recipe.model.js");
const User = require("../models/User.model.js");

module.exports = {
  getAllRecipes: async (_, res) => {
    try {
      const allRecipes = await Recipe.find();
      res.status(200).json(allRecipes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getTop3Recipes: async (_, res) => {
    try {
      const top3Recipes = await Recipe.find({})
        .sort({ likeCount: "desc" })
        .limit(3);
      res.status(200).json(top3Recipes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getUserLikedRecipes: async (req, res) => {
    try {
      const user = await User.findById(req.body.user._id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      res.status(200).json(user.likes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getUserRecipes: async (req, res) => {
    try {
      const user = await User.findById(req.body.user._id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      res.status(200).json(user.recipes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getRecipeById: async (req, res) => {
    const { recipeId } = req.params;
    try {
      const recipe = await Recipe.findById(recipeId);
      res.status(200).json(recipe);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  createRecipe: async (req, res) => {
    const {
      title,
      cuisine,
      ingredients,
      user: { username, _id },
    } = req.body;
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      if (user.recipes.some((recipe) => recipe.title === title)) {
        return res
          .status(400)
          .json({ titleExists: "You already have recipe with that title" });
      }
      const newRecipe = await Recipe.create({
        userId: _id,
        username,
        title,
        cuisine,
        ingredients,
        createdAt: new Date(),
      });
      // push new recipe to user recipes
      const userRecipes = [...user.recipes, newRecipe];
      user.recipes = userRecipes;
      await user.save();
      res.status(201).json({ userRecipes, currentRecipe: newRecipe });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  updateRecipe: async (req, res) => {
    const {
      user: { _id },
      title,
      cuisine,
      ingredients,
      ...rest
    } = req.body;
    const { recipeId } = req.params;
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      const currentRecipe = {
        title,
        cuisine,
        ingredients,
        _id: recipeId,
        createdAt: new Date(),
        ...rest,
      };
      const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, {
        title,
        cuisine,
        ingredients,
        createdAt: new Date(),
      });
      if (!updatedRecipe) {
        return res.status(400).json({ error: "No recipe found with that id" });
      }
      const updatedUserRecipes =
        user.recipes.length <= 1
          ? [currentRecipe]
          : user.recipes.map(
              (recipe) =>
                (recipe = recipe._id.equals(recipeId) ? currentRecipe : recipe)
            );
      user.recipes = updatedUserRecipes;
      await user.save();
      res.status(200).json({
        userRecipes: updatedUserRecipes,
        currentRecipe,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteRecipe: async (req, res) => {
    const {
      user: { _id },
    } = req.body;
    const { recipeId } = req.params;
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
      if (!deletedRecipe) {
        return res.status(400).json({ error: "No recipe found with that id" });
      }
      // delete user recipes corresponding to deleted recipe
      const updatedUserRecipes = user.recipes.filter(
        ({ _id }) => !_id.equals(deletedRecipe._id)
      );
      user.recipes = updatedUserRecipes;
      await user.save();
      res.status(200).json({
        userRecipes: updatedUserRecipes,
        currentRecipe: deletedRecipe,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  handleLike: async (req, res) => {
    const {
      user: { _id, username },
      liked,
      likeCount,
    } = req.body;
    const { recipeId } = req.params;
    try {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(400).json({ error: "No user found" });
      }
      // increment like count depending on whether or not the recipe has been liked
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(400).json({ error: "No recipe found with that id" });
      }
      // add or remove from recipe likes depending on if user liked recipe
      recipe.likeCount = Number(likeCount);
      const recipeLikedBy = liked
        ? [...recipe.likedBy, user.username]
        : recipe.likedBy.filter((_username) => _username !== username);
      recipe.likedBy = recipeLikedBy;
      await recipe.save();
      // add or remove from user likes depending on if user liked recipe
      const userLikes = liked
        ? [...user.likes, recipe]
        : user.likes.filter(({ _id }) => !_id.equals(recipe._id));
      user.likes = userLikes;
      await user.save();
      // handle notifications for recipe owner
      if (liked) {
        const recipeUser = await User.findById(recipe.userId);
        if (recipeUser.notifications.length === 0) {
          recipeUser.notifications.push({
            username: user.username,
            recipeTitle: recipe.title,
            notificationType: "Like",
          });
          await recipeUser.save();
        } else if (
          !recipeUser.notifications.some(
            (notification) => notification.recipeTitle === recipe.recipeTitle
          )
        ) {
          recipeUser.notifications.push({
            username: user.username,
            recipeTitle: recipe.title,
            notificationType: "Like",
          });
          await recipeUser.save();
        }
      }
      res
        .status(200)
        .json({ currentRecipe: recipe, userLikedRecipes: userLikes });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
