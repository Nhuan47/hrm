import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addSupervisorAPI,
  updateSupervisorAPI,
  deleteSupervisorAPI
} from '@/api/employee/reportToAPI';
import { showNotification } from '@/utils/utils';

const initialState = {
  supervisors: [],
  methods: [],
  isLoading: false,
  isOpenModal: false,
  currentId: null
};

// Add supervisor
export const addSupervisor = createAsyncThunk(
  // Type
  'employee/add-supervisor',
  // payload creator
  async (formData, { rejectWithValue }) => {
    try {
      // Call API to add new supervisor for employee
      const res = await addSupervisorAPI(formData);
      if (res.status === 201) {
        const { data } = res;
        return data;
      } else {
        console.log(res);
        return rejectWithValue(res);
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// update supervisor
export const updateSupervisor = createAsyncThunk(
  // Type
  'employee/update-supervisor',
  // payload creator
  async (formData, { rejectWithValue }) => {
    try {
      // Call API to update the supervisor for employee
      const res = await updateSupervisorAPI(formData);
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

// delete supervisor
export const deleteSupervisor = createAsyncThunk(
  // Type
  'employee/delete-supervisor',
  // payload creator
  async (formData, { rejectWithValue }) => {
    try {
      // Call API to update the supervisor for employee
      const res = await deleteSupervisorAPI(formData);
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
const supervisorSlice = createSlice({
  name: 'reportTo',
  initialState,
  reducers: {
    openSupervisorModal: (state, action) => {
      state.isOpenModal = action.payload;
    },
    setCurrentSupervisorId: (state, action) => {
      state.currentId = action.payload;
    },
    loadSupervisors: (state, action) => {
      state.supervisors = [...action.payload];
    }
  },
  extraReducers: builder => {
    builder
      // Add supervisor
      .addCase(addSupervisor.pending, state => {
        state.isLoading = true;
      })
      .addCase(addSupervisor.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isOpenModal = false;
        state.supervisors = [...state.supervisors, payload];

        // Show message notification
        showNotification('Supervisor added successfully', 'success');
      })
      .addCase(addSupervisor.rejected, (state, { payload }) => {
        state.isOpenModal = false;
        state.isLoading = false;

        // Show error notification
        showNotification('Failed to add supervisor', 'error');
      })

      // Update supervisor
      .addCase(updateSupervisor.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateSupervisor.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isOpenModal = false;
        let supervisorUpdated = state.supervisors.map(item => {
          if (item.id === payload.id) {
            return payload;
          }
          return item;
        });
        state.supervisors = supervisorUpdated;

        // Show message notification
        showNotification('Supervisor updated successfully', 'success');
      })
      .addCase(updateSupervisor.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isOpenModal = false;

        // Show error notification
        showNotification('Failed to update supervisor', 'error');
      })

      //  Delete Supervisor
      .addCase(deleteSupervisor.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteSupervisor.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isOpenModal = false;
        let supervisorRemaining = state.supervisors.filter(
          item => !payload.includes(item.id)
        );
        state.supervisors = supervisorRemaining;

        // Show success notification
        showNotification('Supervisor deleted successfully', 'success');
      })
      .addCase(deleteSupervisor.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isOpenModal = false;

        // Show an error notification with the error message
        showNotification(`Failed to delete supervisor`, 'error');
      });
  }
});

export default supervisorSlice.reducer;
export const { openSupervisorModal, setCurrentSupervisorId, loadSupervisors } =
  supervisorSlice.actions;
