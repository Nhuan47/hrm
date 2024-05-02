import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as folderApi from '../_services/folder-service';
import * as api from '../_services/catelogue-service';

const initialState = {
    folders: [],
    reports: [],
    currentFolderEditing: null
};

export const fetchFolders = createAsyncThunk(
    'report-analysis/fetch-report-folders',
    async (_, { rejectWithValue }) => {
        try {
            // Call api to fecth report folders
            const { status, data } = await folderApi.getFolders();
            if (status === 200) {
                return data;
            } else {
                return rejectWithValue({
                    data
                });
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// Function to add new report folder
export const addFolder = createAsyncThunk(
    'report-analysis/add-folder',
    async (formData, { rejectWithValue }) => {
        try {
            // call api to add new folder
            const { status, data } = await api.addFolder(formData);

            if (status === 201) {
                return data;
            } else {
                return rejectWithValue(data);
            }
        } catch (err) {
            console.log(err);
        }
    }
);

export const deleteFolder = createAsyncThunk(
    'report-analysis/delete-folder',
    async (folder, { rejectWithValue }) => {
        try {
            // Call api to delete report folder
            const { status, data } = await api.deleteFolder(folder);

            if (status === 200) {
                return data;
            } else {
                return rejectWithValue({
                    data
                });
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

// Function to add new report folder
export const updateFolder = createAsyncThunk(
    'report-analysis/update-folder',
    async (folder, { rejectWithValue }) => {
        try {
            // call api to update folder
            const { status, data } = await api.updateFolder(folder);

            if (status === 200) {
                return data;
            } else {
                return rejectWithValue(data);
            }
        } catch (err) {
            console.log(err);
        }
    }
);

export const fetchReports = createAsyncThunk(
    'report-analysis/fetch-reports',
    async (_, { rejectWithValue }) => {
        try {
            // Call api to fecth report folders
            const { status, data } = await api.getReports();

            if (status === 200) {
                return data;
            } else {
                return rejectWithValue({
                    data
                });
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteReport = createAsyncThunk(
    'report-analysis/delete-report',
    async (report, { rejectWithValue }) => {
        try {
            // Call api to fecth report folders
            const { status, data } = await api.deleteReport(report.id);
            if (status === 200) {
                return data;
            } else {
                return rejectWithValue({
                    data
                });
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const analysisSlice = createSlice({
    name: 'catalogue',
    initialState,
    reducers: {
        loadFolderUpdating: (state, action) => {
            state.currentFolderEditing = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            // Add folder
            .addCase(addFolder.pending, state => {})
            .addCase(addFolder.fulfilled, (state, { payload }) => {
                state.folders = [...state.folders, payload];
            })
            .addCase(addFolder.rejected, (state, { payload }) => {
                state.folders = [...state.folders];
            })

            .addCase(updateFolder.pending, state => {})
            .addCase(updateFolder.fulfilled, (state, { payload }) => {
                state.folders = state.folders.map(folder => {
                    if (folder.id === +payload.id) {
                        return payload;
                    }
                    return folder;
                });
            })
            .addCase(updateFolder.rejected, (state, { payload }) => {
                state.folders = [...state.folders];
            })

            // Remove folder
            .addCase(deleteFolder.pending, state => {})
            .addCase(deleteFolder.fulfilled, (state, { payload }) => {
                state.folders = state.folders.filter(
                    folder => folder.id !== +payload.id
                );
            })
            .addCase(deleteFolder.rejected, (state, { payload }) => {
                state.folders = [...state.folders];
            })

            // Fetch folders
            .addCase(fetchFolders.pending, state => {
                // Turn on loading
                state.isLoading = true;
            })
            .addCase(fetchFolders.fulfilled, (state, { payload }) => {
                // Turn on loading
                state.isLoading = true;
                state.folders = payload;
            })
            .addCase(fetchFolders.rejected, (state, { payload }) => {
                // Turn of loading
                state.isLoading = false;
            })

            // Fetch reports
            .addCase(fetchReports.pending, state => {
                // Turn on loading
                state.isLoading = true;
            })
            .addCase(fetchReports.fulfilled, (state, { payload }) => {
                // Turn on loading
                state.isLoading = true;
                state.reports = payload;
            })
            .addCase(fetchReports.rejected, (state, { payload }) => {
                // Turn of loading
                state.isLoading = false;
            })

            // Remove report
            .addCase(deleteReport.pending, state => {})
            .addCase(deleteReport.fulfilled, (state, { payload }) => {
                state.reports = state.reports.filter(
                    item => item.id !== +payload.id
                );
            })
            .addCase(deleteReport.rejected, (state, { payload }) => {});
    }
});

export default analysisSlice.reducer;
export const { loadFolderUpdating } = analysisSlice.actions;
