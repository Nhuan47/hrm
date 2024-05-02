import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';

import * as api from '../_services/auth-api';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/shared/constants';

// get token from local storage
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
        token
    };
};

const state = getInitialState();

const initialState = { ...state, permissions: null, isLoading: false };

// Login method
export const signIn = createAsyncThunk(
    // type
    'auth/login',

    // payloadCreator
    async (formData, { rejectWithValue }) => {
        try {
            // call api to login with username and password
            const res = await api.signIn(formData);

            if (res.status === 200) {
                const { data } = res;

                // store user's token in local storage
                localStorage.setItem(
                    ACCESS_TOKEN_KEY,
                    JSON.stringify(data?.token)
                );

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

// Logout method
export const signOut = createAsyncThunk(
    '/auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            // call api to logout the current user
            const res = await api.signOut();

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
    reducers: {
        onLoadPermissions: (state, { payload }) => {
            state.permissions = payload;
        }
    },
    extraReducers: builder => {
        // Login
        builder
            .addCase(signIn.pending, state => {
                state.isLoading = true;
            })
            .addCase(signIn.fulfilled, (state, { payload }) => {
                // Handle fulfilled action and update state
                let { token, permissions } = payload;
                let userInfo = jwt_decode(token);

                state.token = token;
                state.userInfo = userInfo;
                state.permissions = permissions;
                state.isLoading = false;
            })
            .addCase(signIn.rejected, (state, { payload }) => {
                // Handle rejected action and update state
                state.token = null;
                state.userInfo = null;
                state.permissions = null;
                state.isLoading = false;
            });

        // Logout
        builder
            .addCase(signOut.pending, state => {})
            .addCase(signOut.fulfilled, state => {
                state.token = null;
                state.userInfo = null;
                state.permissions = null;
            })
            .addCase(signOut.rejected, (state, { payload }) => {
                // Handle rejected action and update state
                state.token = null;
                state.userInfo = null;
                state.permissions = null;
            });
    }
});

export default authSlice.reducer;
export const { onLoadPermissions } = authSlice.actions;
