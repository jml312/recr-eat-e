import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as userAPI from "api/user.api";

export const getCurrentUser = createAsyncThunk(
  "users/myprofile",
  async (_, { rejectWithValue }) => {
    try {
      return await userAPI.getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const getUserByUsername = createAsyncThunk(
  "users/userprofile",
  async (data, { rejectWithValue }) => {
    try {
      return await userAPI.getUserByUsername(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const clearNotifications = createAsyncThunk(
  "users/clearNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await userAPI.clearNotifications();
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const updateAccount = createAsyncThunk(
  "users/updateAccount",
  async (data, { rejectWithValue }) => {
    try {
      return await userAPI.updateAccount(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const handleFollow = createAsyncThunk(
  "users/follow",
  async (data, { rejectWithValue }) => {
    try {
      return await userAPI.handleFollow(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const deleteLikes = createAsyncThunk(
  "users/deleteLikes",
  async (data, { rejectWithValue }) => {
    try {
      return await userAPI.deleteLikes(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const deleteRecipes = createAsyncThunk(
  "users/deleteRecipe",
  async (data, { rejectWithValue }) => {
    try {
      return await userAPI.deleteRecipes(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "users/deleteAccount",
  async (data, { rejectWithValue }) => {
    try {
      return await userAPI.deleteAccount(data);
    } catch (error) {
      return rejectWithValue(error.data);
    }
  }
);

const initialState = {
  currentUser: {},
  token: localStorage.token,
  isAccountUpdated: false,
  isRecipesDeleted: false,
  isLikesDeleted: false,
  isAccountDeleted: false,
  didFollow: false,
  didUnfollow: false,
  isLoading: false,
  errors: {},
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearToast: (state, _) => {
      state.isAccountUpdated = false;
      state.didFollow = false;
      state.didUnfollow = false;
      state.isRecipesDeleted = false;
      state.isLikesDeleted = false;
    },
  },
  extraReducers: {
    [getCurrentUser.pending]: (state, _) => {
      state.isLoading = true;
    },
    [getUserByUsername.pending]: (state, _) => {
      state.isLoading = true;
    },
    [updateAccount.pending]: (state, _) => {
      state.isLoading = true;
    },
    [handleFollow.pending]: (state, _) => {
      state.isLoading = true;
    },
    [deleteLikes.pending]: (state, _) => {
      state.isLoading = true;
    },
    [deleteRecipes.pending]: (state, _) => {
      state.isLoading = true;
    },
    [deleteAccount.pending]: (state, _) => {
      state.isLoading = true;
    },
    [clearNotifications.pending]: (state, _) => {
      state.isLoading = true;
    },
    [getCurrentUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
    },
    [getUserByUsername.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
    },
    [updateAccount.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isAccountUpdated = true;
      state.token = action.payload.token;
    },
    [handleFollow.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.currentUser.followers = action.payload.userToFollowFollowers;
      state.didFollow = action.payload.following ? true : false;
      state.didUnfollow = !action.payload.following ? true : false;
    },
    [deleteLikes.fulfilled]: (state, _) => {
      state.isLoading = false;
      state.isLikesDeleted = true;
    },
    [deleteRecipes.fulfilled]: (state, _) => {
      state.isLoading = false;
      state.isRecipesDeleted = true;
    },
    [deleteAccount.fulfilled]: (state, _) => {
      state.isLoading = false;
      state.isAccountDeleted = true;
    },
    [clearNotifications.fulfilled]: (state, action) => {
      state.isLoading = false;
      localStorage.hasReadNotifications = true;
    },
    [getCurrentUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [getUserByUsername.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [updateAccount.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [handleFollow.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [deleteLikes.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [deleteRecipes.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [deleteAccount.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [clearNotifications.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
  },
});

export const { clearToast } = user.actions;
export default user.reducer;
