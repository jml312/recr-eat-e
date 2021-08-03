import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as recipesAPI from "api/recipes.api";

export const getAllRecipes = createAsyncThunk(
  "recipes/allRecipes",
  async (_, { rejectWithValue }) => {
    try {
      return await recipesAPI.getAllRecipes();
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const getTop3Recipes = createAsyncThunk(
  "recipes/top3",
  async (_, { rejectWithValue }) => {
    try {
      return await recipesAPI.getTop3Recipes();
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const getUserLikedRecipes = createAsyncThunk(
  "recipes/userlikedrecipes",
  async (_, { rejectWithValue }) => {
    try {
      return await recipesAPI.getUserLikedRecipes();
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const getUserRecipes = createAsyncThunk(
  "recipes/userrecipes",
  async (_, { rejectWithValue }) => {
    try {
      return await recipesAPI.getUserRecipes();
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const getRecipeById = createAsyncThunk(
  "recipes/recipebyid",
  async (data, { rejectWithValue }) => {
    try {
      return await recipesAPI.getRecipeById(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const createRecipe = createAsyncThunk(
  "recipes/createrecipe",
  async (data, { rejectWithValue }) => {
    try {
      return await recipesAPI.createRecipe(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const updateRecipe = createAsyncThunk(
  "recipes/updaterecipe",
  async (data, { rejectWithValue }) => {
    try {
      return await recipesAPI.updateRecipe(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleterecipe",
  async (data, { rejectWithValue }) => {
    try {
      return await recipesAPI.deleteRecipe(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const deleteUserRecipes = createAsyncThunk(
  "recipes/deleteuserrecipes",
  async (_, { rejectWithValue }) => {
    try {
      return await recipesAPI.deleteUserRecipes();
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const handleLike = createAsyncThunk(
  "recipes/handleLike",
  async (data, { rejectWithValue }) => {
    try {
      return await recipesAPI.handleLike(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

const initialState = {
  allRecipes: [],
  top3Recipes: [],
  userLikedRecipes: [],
  userRecipes: [],
  currentRecipe: {},
  isRecipeCreated: false,
  isRecipeUpdated: false,
  isRecipeDeleted: false,
  isLoading: false,
  errors: {},
};

const recipes = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setAllRecipes: (state, action) => {
      state.isLoading = false;
      state.allRecipes = action.payload;
    },
    setTop3Recipes: (state, action) => {
      state.isLoading = false;
      state.top3Recipes = action.payload;
    },
    setUserRecipes: (state, action) => {
      state.isLoading = false;
      state.userRecipes = action.payload;
    },
    setUserLikedRecipes: (state, action) => {
      state.isLoading = false;
      state.userLikedRecipes = action.payload;
    },
    clearToast: (state, _) => {
      state.isRecipeCreated = false;
      state.isRecipeUpdated = false;
      state.isRecipeDeleted = false;
    },
  },
  extraReducers: {
    [getAllRecipes.pending]: (state, _) => {
      state.isLoading = true;
      state.allRecipes = [1, 2, 3, 4, 5, 6];
    },
    [getTop3Recipes.pending]: (state, _) => {
      state.isLoading = true;
      state.top3Recipes = [1, 2, 3];
    },
    [getUserLikedRecipes.pending]: (state) => {
      state.isLoading = true;
    },
    [getUserRecipes.pending]: (state) => {
      state.isLoading = true;
    },
    [getRecipeById.pending]: (state) => {
      state.isLoading = true;
    },
    [createRecipe.pending]: (state, _) => {
      state.isLoading = true;
    },
    [updateRecipe.pending]: (state, _) => {
      state.isLoading = true;
    },
    [deleteRecipe.pending]: (state, _) => {
      state.isLoading = true;
    },
    [handleLike.pending]: (state, _) => {
      state.isLoading = true;
    },
    [getAllRecipes.fulfilled]: (state, action) => {
      state.allRecipes = action.payload;
      state.isLoading = false;
    },
    [getTop3Recipes.fulfilled]: (state, action) => {
      state.top3Recipes = action.payload;
      state.isLoading = false;
    },
    [getUserLikedRecipes.fulfilled]: (state, action) => {
      state.userLikedRecipes = action.payload;
      state.isLoading = false;
    },
    [getUserRecipes.fulfilled]: (state, action) => {
      state.userRecipes = action.payload;
      state.isLoading = false;
    },
    [getRecipeById.fulfilled]: (state, action) => {
      state.currentRecipe = action.payload;
      state.isLoading = false;
    },
    [createRecipe.fulfilled]: (state, action) => {
      state.currentRecipe = action.payload.currentRecipe;
      state.userRecipes = action.payload.userRecipes;
      state.totalRecipes = state.totalRecipes + 1;
      state.isRecipeCreated = true;
      state.isLoading = false;
    },
    [updateRecipe.fulfilled]: (state, action) => {
      state.currentRecipe = action.payload.currentRecipe;
      state.userRecipes = action.payload.userRecipes;
      state.isRecipeUpdated = true;
      state.isLoading = false;
    },
    [deleteRecipe.fulfilled]: (state, action) => {
      state.currentRecipe = action.payload.currentRecipe;
      state.userRecipes = action.payload.userRecipes;
      state.totalRecipes = state.totalRecipes - 1;
      state.isRecipeDeleted = true;
      state.isLoading = false;
    },
    [handleLike.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.currentRecipe = action.payload.currentRecipe;
      state.userLikedRecipes = action.payload.userLikedRecipes;
    },
    [getAllRecipes.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [getTop3Recipes.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [getUserLikedRecipes.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [getUserRecipes.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [getRecipeById.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [createRecipe.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [updateRecipe.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [deleteRecipe.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [handleLike.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
  },
});

export const {
  setAllRecipes,
  setUserRecipes,
  clearToast,
  setTop3Recipes,
  setUserLikedRecipes,
} = recipes.actions;
export default recipes.reducer;
