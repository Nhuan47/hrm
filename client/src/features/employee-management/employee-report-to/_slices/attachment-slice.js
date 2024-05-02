import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
    getAttachments,
    addAttachment,
    updateAttachment,
    deleteAttachment
} from '../_services/attachment-service';

const initialState = {
    isOpenModal: false,
    isLoading: false,
    attachments: [],
    currentId: null
};

export const onFetchAttachments = createAsyncThunk(
    // Type
    'employee-report-to/fetch-attachment',
    // payload creator
    async (employeeId, { rejectWithValue }) => {
        try {
            // Call API to add new subordinate for employee
            const { data, status, message } = await getAttachments(employeeId);
            if (status === 200) {
                return data;
            } else {
                console.log();
                return rejectWithValue(res);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// Add subordinate
export const onAddAttachment = createAsyncThunk(
    // Type
    'employee-report-to/add-attachment',
    // payload creator
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to add new subordinate for employee
            const res = await addAttachment(formData);

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

export const onUpdateAttachment = createAsyncThunk(
    // Type
    'employee-report-to/update-attachment',
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to add the assign attachment file
            let res = await updateAttachment(formData);
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

export const onDeleteAttachment = createAsyncThunk(
    // Type
    'employee-report-to/delete-attachment',
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to add the assign attachment file
            let res = await updateAttachment(formData);
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
            .addCase(onAddAttachment.pending, state => {
                state.isLoading = true;
            })
            .addCase(onAddAttachment.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
                state.attachments = [...state.attachments, ...payload];
            })
            .addCase(onAddAttachment.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
            })

            // Handle reducer to delete attachment file

            .addCase(onDeleteAttachment.pending, state => {
                state.isLoading = true;
            })
            .addCase(onDeleteAttachment.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
                let attachRemaining = state.attachments.filter(
                    item => !payload.includes(item.id)
                );
                state.attachments = attachRemaining;
            })
            .addCase(onDeleteAttachment.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
            })

            // Handle reducer to update attachment file
            .addCase(onUpdateAttachment.pending, state => {
                state.isLoading = true;
            })
            .addCase(onUpdateAttachment.fulfilled, (state, { payload }) => {
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
            })
            .addCase(onUpdateAttachment.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isOpenModal = false;
                state.currentId = null;
            });
    }
});

export default assignAttachmentSlice.reducer;
export const { activeModal, loadAssignAttachments, setCurrentAttachmentId } =
    assignAttachmentSlice.actions;
