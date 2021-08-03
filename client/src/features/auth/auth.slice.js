import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authAPI from "api/auth.api";
import jwt_decode from "jwt-decode";

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const { token } = await authAPI.login(data);
      // Set token to local storage
      localStorage.setItem("token", token);
      // Decode token to get user data
      return jwt_decode(token);
    } catch ({ data }) {
      return rejectWithValue(data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const { token } = await authAPI.register(data);
      // Set token to local storage
      localStorage.setItem("token", token);
      // Decode token to get user data
      return jwt_decode(token);
    } catch ({ data }) {
      return rejectWithValue(data);
    }
  }
);

export const googleAuth = createAsyncThunk(
  "auth/googleauth",
  async (data, { rejectWithValue }) => {
    try {
      const { token } = await authAPI.googleAuth(data);
      // Set token to local storage
      localStorage.setItem("token", token);
      // Decode token to get user data
      return { user: jwt_decode(token) };
    } catch ({ data }) {
      return rejectWithValue(data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotpassword",
  async (data, { rejectWithValue }) => {
    try {
      const { isEmailSent } = await authAPI.forgotPassword(data);
      return { isEmailSent };
    } catch ({ data }) {
      return rejectWithValue(data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetpassword",
  async (data, { rejectWithValue }) => {
    try {
      const { isPasswordReset } = await authAPI.resetPassword(data);
      return { isPasswordReset };
    } catch ({ data }) {
      return rejectWithValue(data);
    }
  }
);

const initialState = {
  isAuthenticated: false,
  userExists: false,
  isEmailSent: false,
  isPasswordReset: false,
  isLoading: false,
  user: {},
  errors: {},
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutUser: (state) => {
      // Remove token from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("hasReadNotifications");
      // reset to initial state
      state.isAuthenticated = false;
      state.userExists = false;
      state.isEmailSent = false;
      state.isPasswordReset = false;
      state.isLoading = false;
      state.user = {};
      state.errors = {};
    },
  },
  extraReducers: {
    [login.pending]: (state, _) => {
      state.isLoading = true;
    },
    [register.pending]: (state, _) => {
      state.isLoading = true;
    },
    [googleAuth.pending]: (state, _) => {
      state.isLoading = true;
    },
    [forgotPassword.pending]: (state, _) => {
      state.isLoading = true;
      state.isEmailSent = false;
    },
    [resetPassword.pending]: (state, _) => {
      state.isLoading = true;
      state.isPasswordReset = false;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    [register.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    [googleAuth.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.userExists = true;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    [forgotPassword.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isEmailSent = action.payload;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.isPasswordReset = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.isLoading = false;
      state.errors = action.payload;
    },
    [googleAuth.rejected]: (state, action) => {
      state.isLoading = false;
      state.userExists = false;
      state.errors = action.payload;
    },
    [forgotPassword.rejected]: (state, action) => {
      state.isLoading = false;
      state.isEmailSent = false;
      state.errors = action.payload;
    },
    [resetPassword.rejected]: (state, action) => {
      state.isLoading = false;
      state.isPasswordReset = false;
      state.errors = action.payload;
    },
  },
});

export const { setCurrentUser, logoutUser } = auth.actions;
export default auth.reducer;
