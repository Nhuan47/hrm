import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';

import { signIn, signOut } from '@/api/authApi';
import { showNotification } from '@/utils/utils';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants/enum';

const getInitialState = () => {
  const tokenInStorage = localStorage.getItem(ACCESS_TOKEN_KEY);
  const token =
    tokenInStorage !== null && tokenInStorage !== undefined
      ? JSON.parse(tokenInStorage)
      : null;
  let userInfo;
  if (token) {
    userInfo = jwt_decode(token);
  } else {
    userInfo = null;
  }
  return {
    userInfo,
    isLoading: false,
    token
  };
};

const initialState = getInitialState();

// Login
export const userLogin = createAsyncThunk(
  // type
  'auth/login',

  // payloadCreator
  async (formData, { rejectWithValue }) => {
    try {
      // call api to login with username and password
      const res = await signIn(formData);

      if (res.status === 200) {
        const { data } = res;
        // store user's token in local storage
        localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(data?.token));
        localStorage.setItem(
          REFRESH_TOKEN_KEY,
          JSON.stringify(data?.refreshToken)
        );
        return res.data;
      } else {
        return rejectWithValue(res);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Logout
export const userLogout = createAsyncThunk(
  '/auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // call api to logout the current user
      const res = await signOut();

      // Remove token in local storage
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Login
    builder
      .addCase(userLogin.pending, state => {
        // Turn on loading
        state.isLoading = true;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        // Handle fulfilled action and update state
        let token = payload.token;
        let userInfo = jwt_decode(token);
        state.isLoading = false;
        state.token = token;
        state.userInfo = userInfo;

        // showNotification('Login successfully', 'success');
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        // Handle rejected action and update state
        state.isLoading = false;
        state.token = null;
        state.userInfo = null;

        showNotification('Incorrect the username or password', 'error');
      });

    // Logout
    builder
      .addCase(userLogout.pending, state => {
        state.isLoading = true;
      })
      .addCase(userLogout.fulfilled, state => {
        state.isLoading = false;
        state.token = null;
        state.userInfo = null;
      })
      .addCase(userLogout.rejected, (state, { payload }) => {
        // Handle rejected action and update stat
      });
  }
});

export default authSlice.reducer;
