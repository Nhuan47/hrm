import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  addSubordinateAPI,
  updateSubordinateAPI,
  deleteSubordinateAPI
} from '@/api/employee/reportToAPI';
import { showNotification } from '@/utils/utils';

const initialState = {
  subordinates: [],
  methods: [],
  isLoading: false,
  isOpenModal: false,
  currentId: null
};

// Add subordinate
export const addSubordinate = createAsyncThunk(
  // Type
  'employee/add-subordinate',
  // payload creator
  async (formData, { rejectWithValue }) => {
    try {
      // Call API to add new subordinate for employee
      const res = await addSubordinateAPI(formData);

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
export const updateSubordinate = createAsyncThunk(
  // Type
  'employee/update-subordinate',
  // payload creator
  async (formData, { rejectWithValue }) => {
    try {
      // Call API to update the subordinate for employee
      const res = await updateSubordinateAPI(formData);
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
export const deleteSubordinate = createAsyncThunk(
  // Type
  'employee/delete-subordinate',
  // payload creator
  async (formData, { rejectWithValue }) => {
    try {
      // Call API to update the subordinate for employee
      const res = await deleteSubordinateAPI(formData);
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
      .addCase(addSubordinate.pending, state => {
        state.isLoading = true;
      })
      .addCase(addSubordinate.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isOpenModal = false;
        state.subordinates = [...state.subordinates, payload];

        // Show success notification
        showNotification('Subordinate added successfully', 'success');
      })
      .addCase(addSubordinate.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isOpenModal = false;

        // Show error notification
        showNotification('Failed to add subordinate', 'error');
      })

      // Update subordinate
      .addCase(updateSubordinate.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateSubordinate.fulfilled, (state, { payload }) => {
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

        // Show success notification
        showNotification('Subordinate updated successfully', 'success');
      })
      .addCase(updateSubordinate.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isOpenModal = false;
        state.currentId = null;

        // Show error notification
        showNotification('Failed to update subordinate', 'error');
      })

      //  Delete Subordinate
      .addCase(deleteSubordinate.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteSubordinate.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isOpenModal = false;
        let subordinateRemaining = state.subordinates.filter(
          item => !payload.includes(item.id)
        );
        state.subordinates = subordinateRemaining;
        // Show success notification
        showNotification('Subordinate deleted successfully', 'success');
      })
      .addCase(deleteSubordinate.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isOpenModal = false;

        // Show an error notification with the error message
        showNotification(`Failed to delete subordinate`, 'error');
      });
  }
});

export default subordinateSlice.reducer;
export const {
  openSubordinateModal,
  setCurrentSubordinateId,
  loadSubordinates
} = subordinateSlice.actions;
