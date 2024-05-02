import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getUserRoles, updateUserRole } from '../_services/user-role-service';

const initialState = {
    isLoading: false,
    idEditing: null,
    userRoles: []
};

// fetch role list from server
export const onFetchUserRoles = createAsyncThunk(
    // Type
    'setting/fetch-user-roles',
    // payload creator
    async (_, { rejectWithValue }) => {
        try {
            // Call API to update the subordinate for employee
            const res = await getUserRoles();
            if (res.status === 200) {
                const { data } = res;
                return data;
            } else {
                return rejectWithValue(res);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// handle add new role
export const onUpdateUserRole = createAsyncThunk(
    // Type
    'setting/update-user-role',
    // payload creator
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to update the subordinate for employee
            const res = await updateUserRole(formData);
            if (res.status === 201) {
                const { data } = res;
                return data;
            } else {
                return rejectWithValue(res);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const userRoleSlice = createSlice({
    name: 'user-role',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder

            // Fetch user roles
            .addCase(onFetchUserRoles.pending, state => {
                state.isLoading = true;
            })
            .addCase(onFetchUserRoles.fulfilled, (state, { payload }) => {
                state.userRoles = [...payload];
                state.isLoading = false;
            })
            .addCase(onFetchUserRoles.rejected, (state, { payload }) => {
                state.userRoles = [...payload];
                state.isLoading = false;
            })

            // Update user roles
            .addCase(onUpdateUserRole.pending, state => {
                state.isLoading = true;
            })
            .addCase(onUpdateUserRole.fulfilled, (state, { payload }) => {
                let dataModified = state.userRoles?.map(item => {
                    if (+item.id === +payload.id) {
                        return payload;
                    } else {
                        return item;
                    }
                });

                state.userRoles = dataModified;
                state.isLoading = false;
            })
            .addCase(onUpdateUserRole.rejected, (state, { payload }) => {
                state.isLoading = false;
            });
    }
});

export default userRoleSlice.reducer;
export const {} = userRoleSlice.actions;
