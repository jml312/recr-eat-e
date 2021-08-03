import request from "utils/request";

// get current user
export const getCurrentUser = () => {
  return request({ url: "user/me", method: "GET" }, true);
};

// get user by username
export const getUserByUsername = ({ username }) => {
  return request({ url: `user/${username}`, method: "GET" }, true);
};

// clear user notifications
export const clearNotifications = () => {
  return request({ url: "user/notifications", method: "PATCH" }, true);
};

// Update user info and recipe username
export const updateAccount = (data) => {
  return request({ url: "user/update", method: "PATCH", data }, true);
};

// handle follow for user
export const handleFollow = (data) => {
  return request({ url: "user/follow", method: "PATCH", data }, true);
};

// delete user likes
export const deleteLikes = (data) => {
  return request({ url: "user/delete-likes", method: "DELETE", data }, true);
};

// delete user recipes
export const deleteRecipes = () => {
  return request({ url: "user/delete-recipes", method: "DELETE" }, true);
};

// delete user account
export const deleteAccount = () => {
  return request({ url: "user/delete-account", method: "DELETE" }, true);
};
