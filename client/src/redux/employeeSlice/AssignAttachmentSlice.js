import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showNotification } from '@/utils/utils';
import {
    addAssignAttachmentAPI,
    deleteAssignAttachmentAPI,
    updateAssignAttachmentAPI
} from '@/api/employee/reportToAPI';

const initialState = {
    isOpenModal: false,
    isLoading: false,
    attachments: [],
    currentId: null
};

// Add subordinate
export const addAttachment = createAsyncThunk(
    // Type
    'employee/add-attachment',
    // payload creator
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to add new subordinate for employee
            const res = await addAssignAttachmentAPI(formData);

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

export const updateAttachment = createAsyncThunk(
    // Type
    'employee/updateAttachment',
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to add the assign attachment file
            let res = await updateAssignAttachmentAPI(formData);
            if (res.status === 201) {
                return res.data;
            } else {
                return rejectWithValue(res);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteAssignAttachment = createAsyncThunk(
    // Type
    'employee/deleteAssignAttachment',
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to add the assign attachment file
            let res = await deleteAssignAttachmentAPI(formData);
            if (res.status === 201) {
                return res.data;
            } else {
                return rejectWithValue(res);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const assignAttachmentSlice = createSlice({
    name: 'attachment',
    initialState,
    reducers: {
        activeModal: (state, { payload }) => {
            state.isOpenModal = payload;
        },
        loadAssignAttachments: (state, { payload }) => {
            state.attachments = [...payload];
        },
        setCurrentAttachmentId: (state, { payload }) => {
            state.currentId = payload;
        }
    },
    extraReducers: builder => {
        builder
            // Handle reducer to add attachment file
            .addCase(addAttachment.pending, state => {
                state.isLoading = true;
            })
            .addCase(addAttachment.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
                state.attachments = [...state.attachments, ...payload];

                // Show success notification
                showNotification('Attachment added successfully', 'success');
            })
            .addCase(addAttachment.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;

                // Show error notification
                showNotification('Failed to add attachment', 'error');
            })

            // Handle reducer to delete attachment file

            .addCase(deleteAssignAttachment.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteAssignAttachment.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
                let attachRemaining = state.attachments.filter(
                    item => !payload.includes(item.id)
                );
                state.attachments = attachRemaining;
                // Show success notification
                showNotification('Attachment deleted successfully', 'success');
            })
            .addCase(deleteAssignAttachment.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;

                // Show error notification
                showNotification('Failed to delete attachment(s)', 'error');
            })

            // Handle reducer to update attachment file
            .addCase(updateAttachment.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateAttachment.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;

                let attachmentUpdated = state.attachments.map(item => {
                    if (item.id === payload.id) {
                        return payload;
                    }
                    return item;
                });
                state.attachments = attachmentUpdated;
                state.currentId = null;

                // Show success notification
                showNotification('Attachment updated successfully', 'success');
            })
            .addCase(updateAttachment.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
                state.currentId = null;

                // Show error notification
                showNotification('Failed to update attachment', 'error');
            });
    }
});

export default assignAttachmentSlice.reducer;
export const { activeModal, loadAssignAttachments, setCurrentAttachmentId } =
    assignAttachmentSlice.actions;
