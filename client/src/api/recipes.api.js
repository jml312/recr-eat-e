import request from "utils/request";

// Get all recipes
export const getAllRecipes = () => {
  return request({ url: "recipes/all", method: "GET" }, true);
};

// Get top 3 recipes
export const getTop3Recipes = () => {
  return request({ url: "recipes/top3", method: "GET" }, true);
};

// Get all recipes from user
export const getUserRecipes = () => {
  return request({ url: "recipes/user", method: "GET" }, true);
};

// Get all liked recipes from user
export const getUserLikedRecipes = () => {
  return request({ url: "recipes/likes", method: "GET" }, true);
};

export const getRecipeById = ({ _id }) => {
  return request({ url: `recipes/recipe/${_id}`, method: "GET" }, true);
};

// Create a recipe for a use
export const createRecipe = (data) => {
  return request({ url: "recipes/create", method: "POST", data }, true);
};

// Update a recipe for a user
export const updateRecipe = ({ _id, ...data }) => {
  return request({ url: `recipes/update/${_id}`, method: "PUT", data }, true);
};

// Delete a recipe for a user
export const deleteRecipe = ({ _id }) => {
  return request({ url: `recipes/delete/${_id}`, method: "DELETE" }, true);
};

// Delete all recipes for a use
export const deleteUserRecipes = () => {
  return request({ url: "recipes/delete", method: "DELETE" }, true);
};

// Add a like for a recipe
export const handleLike = ({ _id, ...data }) => {
  return request({ url: `recipes/like/${_id}`, method: "PATCH", data }, true);
};
