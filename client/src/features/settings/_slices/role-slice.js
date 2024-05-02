import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
    getRoles,
    getRoleEditing,
    deleteRole,
    updateRole,
    addRole
} from '../_services/manage-role-service';

const initialState = {
    isLoading: false,
    roleEditing: null,
    roles: []
};

// fetch role list from server
export const onFetchRoles = createAsyncThunk(
    // Type
    'setting/fetch-roles',
    // payload creator
    async (_, { rejectWithValue }) => {
        try {
            // Call API to update the subordinate for employee
            const res = await getRoles();
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

// fetch role list from server
export const onFetchRoleEditing = createAsyncThunk(
    // Type
    'setting/fetch-role-editing',
    // payload creator
    async (id, { rejectWithValue }) => {
        try {
            // Call API to update the subordinate for employee
            const res = await getRoleEditing({ id });
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
export const onAddRole = createAsyncThunk(
    // Type
    'setting/add-role',
    // payload creator
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to update the subordinate for employee
            const res = await addRole(formData);
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

// handle add new role
export const onUpdateRole = createAsyncThunk(
    // Type
    'setting/update-role',
    // payload creator
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to update the subordinate for employee
            const res = await updateRole(formData);
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

// delete role
export const onDeleteRole = createAsyncThunk(
    // Type
    'setting/delete-role',
    // payload creator
    async (id, { rejectWithValue }) => {
        try {
            // Call API to update the subordinate for employee
            const res = await deleteRole(id);
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

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder

            // Fetch roles
            .addCase(onFetchRoles.pending, state => {
                state.isLoading = true;
            })
            .addCase(onFetchRoles.fulfilled, (state, { payload }) => {
                state.roles = [...payload];
                state.isLoading = false;
            })
            .addCase(onFetchRoles.rejected, (state, { payload }) => {
                state.roles = [...payload];
                state.isLoading = false;
            })

            // Fetch role editing
            .addCase(onFetchRoleEditing.pending, state => {
                state.isLoading = true;
            })
            .addCase(onFetchRoleEditing.fulfilled, (state, { payload }) => {
                state.roleEditing = payload;
                state.isLoading = false;
            })
            .addCase(onFetchRoleEditing.rejected, (state, { payload }) => {
                state.roleEditing = null;
                state.isLoading = false;
            })

            // Add new role
            .addCase(onAddRole.pending, state => {
                state.isLoading = true;
            })
            .addCase(onAddRole.fulfilled, (state, { payload }) => {
                state.roles = [...state.roles, payload];
                state.isLoading = false;
            })
            .addCase(onAddRole.rejected, (state, { payload }) => {
                state.isLoading = false;
            })

            // Update role
            .addCase(onUpdateRole.pending, state => {
                state.isLoading = true;
            })
            .addCase(onUpdateRole.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.roleEditing = null;
            })
            .addCase(onUpdateRole.rejected, (state, { payload }) => {
                state.isLoading = false;
            })

            // Delete role
            .addCase(onDeleteRole.pending, state => {
                state.isLoading = true;
            })
            .addCase(onDeleteRole.fulfilled, (state, { payload }) => {
                let roles = state.roles.filter(
                    role => +role.id !== +payload.id
                );
                state.roles = roles;
                state.isLoading = false;
            })
            .addCase(onDeleteRole.rejected, (state, { payload }) => {
                state.isLoading = false;
            });
    }
});

export default roleSlice.reducer;
export const {} = roleSlice.actions;
