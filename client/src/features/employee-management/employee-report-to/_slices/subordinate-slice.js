import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
    addSubordinate,
    updateSubordinate,
    deleteSubordinate
} from '../_services/subordinate-service';

const initialState = {
    subordinates: [],
    methods: [],
    isLoading: false,
    isOpenModal: false,
    currentId: null
};

// Add subordinate
export const onAddSubordinate = createAsyncThunk(
    // Type
    'employee/add-subordinate',
    // payload creator
    async (formData, { rejectWithValue }) => {
        try {
            // Call  to add new subordinate for employee
            const res = await addSubordinate(formData);

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

// update subordinate
export const onUpdateSubordinate = createAsyncThunk(
    // Type
    'employee/update-subordinate',
    // payload creator
    async (formData, { rejectWithValue }) => {
        try {
            // Call  to update the subordinate for employee
            const res = await updateSubordinate(formData);
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

// delete subordinate
export const onDeleteSubordinate = createAsyncThunk(
    // Type
    'employee/delete-subordinate',
    // payload creator
    async (formData, { rejectWithValue }) => {
        try {
            // Call  to update the subordinate for employee
            const res = await deleteSubordinate(formData);
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

// Create slice
const subordinateSlice = createSlice({
    name: 'reportTo',
    initialState,
    reducers: {
        openSubordinateModal: (state, action) => {
            state.isOpenModal = action.payload;
        },
        setCurrentSubordinateId: (state, action) => {
            state.currentId = action.payload;
        },
        loadSubordinates: (state, action) => {
            state.subordinates = [...action.payload];
        }
    },
    extraReducers: builder => {
        builder
            // Add subordinate
            .addCase(onAddSubordinate.pending, state => {
                state.isLoading = true;
            })
            .addCase(onAddSubordinate.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
                state.subordinates = [...state.subordinates, payload];
            })
            .addCase(onAddSubordinate.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
            })

            // Update subordinate
            .addCase(onUpdateSubordinate.pending, state => {
                state.isLoading = true;
            })
            .addCase(onUpdateSubordinate.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
                let subordinateUpdated = state.subordinates.map(item => {
                    if (item.id === payload.id) {
                        return payload;
                    }
                    return item;
                });
                state.subordinates = subordinateUpdated;
                state.currentId = null;
            })
            .addCase(onUpdateSubordinate.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
                state.currentId = null;
            })

            //  Delete Subordinate
            .addCase(onDeleteSubordinate.pending, state => {
                state.isLoading = true;
            })
            .addCase(onDeleteSubordinate.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
                let subordinateRemaining = state.subordinates.filter(
                    item => !payload.includes(item.id)
                );
                state.subordinates = subordinateRemaining;
            })
            .addCase(onDeleteSubordinate.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
            });
    }
});

export default subordinateSlice.reducer;
export const {
    openSubordinateModal,
    setCurrentSubordinateId,
    loadSubordinates
} = subordinateSlice.actions;
