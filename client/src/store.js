import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "features/auth/auth.slice";
import recipesReducer from "features/recipes/recipes.slice";
import userReducer from "features/user/user.slice";

// combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  recipes: recipesReducer,
  user: userReducer,
});

// create the store
const store = configureStore({
  reducer: rootReducer,
});

export default store;
