import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as api from '../_services/definition-service';

const initialState = {
    // Definition
    folderId: null,
    reportName: null,
    currentId: null,
    selectedDisplayFields: null,
    selectedFilters: null,
    selectedGroupByFields: null,
    availableDisplayGroups: null,
    availableFilterGroups: null,
    availableFilters: {},

    isActiveModal: false,
    isLoading: false,
    isActiveChart: true,

    chartInfo: {},

    // Folder modal
    isActiveFolderModal: false,
    currentFolderIdEditing: null,
    folders: [],

    currentStep: 1
};

export const loadDefinition = createAsyncThunk(
    // type
    'report-definintion/load-definition',
    async (reportId, { rejectWithValue }) => {
        try {
            // Call api to fecth report definition by report id
            const { status, data, meta } = await api.getCurrentReportDefinition(
                reportId
            );
            if (status === 200) {
                return { data, meta };
            } else {
                return rejectWithValue({
                    data,
                    meta
                });
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const saveReportDefinition = createAsyncThunk(
    // type
    'report-definintion/save-report',
    async (formData, { rejectWithValue }) => {
        try {
            // call api to save the group by
            const { status, data } = await api.saveReportDefinition(formData);
            if (status === 201) {
                return data;
            } else {
                return rejectWithValue(data);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const definitionSlice = createSlice({
    name: 'definition',
    initialState,
    reducers: {
        loadFolders: (state, action) => {
            state.folders = action.payload;
        },
        // Set curent id of folder edit
        setFolderIdEditing: (state, action) => {
            state.currentFolderIdEditing = action.payload;
        },

        updateStep: (state, action) => {
            state.currentStep = state.currentStep + action.payload;
        },
        loadFilters: (state, action) => {
            state.selectedFilters = action.payload;
        },
        activeModal: (state, action) => {
            state.isActiveModal = action.payload;
        },
        loadChartData: (state, action) => {
            state.chartInfo.records = action.payload.records;
            state.chartInfo.headers = action.payload.headers;
            state.chartInfo.chartType = action.payload.chartType;
        }
    },
    extraReducers: builder => {
        builder

            // LOAD DEFINITION
            // Load definition by report id
            .addCase(loadDefinition.pending, state => {
                // Turn on loading
                state.isLoading = true;
            })
            .addCase(loadDefinition.fulfilled, (state, { payload }) => {
                // set data
                state.currentId = payload.data.id;
                state.folderId = payload.data.folderId;
                state.reportName = payload.data.name;
                state.selectedDisplayFields =
                    payload.data.selectedDisplayFields;
                state.selectedFilters = payload.data.selectedFilters;
                state.selectedGroupByFields =
                    payload.data.selectedGroupByFields;

                // Set meta data
                state.availableDisplayGroups =
                    payload.meta.availableDisplayGroups;
                state.availableFilterGroups =
                    payload.meta.availableFilterGroups;
                state.availableFilters = payload.meta.availableFilters;

                // Turn Off loading
                state.isLoading = false;
            })
            .addCase(loadDefinition.rejected, (state, { payload }) => {
                // Turn Off loading
                state.isLoading = false;
            })

            // Save report
            .addCase(saveReportDefinition.pending, state => {
                state.isLoading = true;
            })
            .addCase(saveReportDefinition.fulfilled, (state, { payload }) => {
                state.isLoading = false;
            })
            .addCase(saveReportDefinition.rejected, (state, { payload }) => {
                state.isLoading = false;
            });
    }
});

export default definitionSlice.reducer;
export const {
    loadFolders,
    updateStep,
    loadFilters,
    activeModal,
    loadChartData
} = definitionSlice.actions;
