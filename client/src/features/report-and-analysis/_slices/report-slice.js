import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/shared/services/axios-instance';

import * as api from '../_services/definition-service';

const initialState = {
    isPublic: false,

    // Definition
    currentId: null,
    reportName: null,

    selectedDisplayFields: null,
    selectedFilters: null,
    selectedGroupByFields: null,

    availableDisplayGroups: null,
    availableFilterGroups: null,
    availableFilters: {},

    isLoading: false,
    chartInfo: {
        chartType: null,
        isActiveModal: false,
        isActiveChart: true // Always show chart
    }
};

export const loadDefinition = createAsyncThunk(
    // type
    'report/load-definition',
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

// Function to save group by of report to database
export const addReportGroupBy = createAsyncThunk(
    // type
    'report/save-group-by',
    async (formData, { rejectWithValue }) => {
        try {
            const { reportId } = formData;
            // call api to save the group by
            const {
                data: { data, status, message }
            } = await axios.post(
                `/reports/definition/${reportId}/save-report-group-by`,
                formData
            );

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

export const removeChart = createAsyncThunk(
    // type
    'report/remove-chart',
    async (report_id, { rejectWithValue }) => {
        try {
            // call api to save the group by
            const {
                data: { status, data }
            } = await axios.delete(`/reports/${report_id}/remove-chart`);
            if (status === 200) {
                return data;
            } else {
                return rejectWithValue(data);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const onPublic = createAsyncThunk(
    // type
    'report/public-report',
    async (formData, { rejectWithValue }) => {
        try {
            const { reportId, isPublic } = formData;
            // call api to save the group by
            const {
                data: { status, data }
            } = await axios.get(
                `/reports/${reportId}/public-report?isPublic=${isPublic}`
            );
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

const reportSlice = createSlice({
    name: 'report',
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
            state.chartInfo.isActiveModal = action.payload;
        },
        activeChart: (state, action) => {
            state.chartInfo.isActiveChart = action.payload;
        },

        loadChartData: (state, action) => {
            state.isLoading = true;

            state.chartInfo.records = action.payload.records;
            state.chartInfo.headers = action.payload.headers;
            state.chartInfo.chartType = action.payload.chartType;

            state.isLoading = false;
        }
    },
    extraReducers: builder => {
        builder

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
                state.isPublic = payload.data.isPublic;
                state.selectedDisplayFields =
                    payload.data.selectedDisplayFields;
                state.selectedFilters = payload.data.selectedFilters;
                state.selectedGroupByFields =
                    payload.data.selectedGroupByFields;

                state.chartInfo.chartType = payload.data.chartType;

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

            // Add report group by
            .addCase(addReportGroupBy.pending, state => {
                state.isLoading = true;
            })
            .addCase(addReportGroupBy.fulfilled, (state, { payload }) => {
                state.isLoading = false;

                // Update group by field
                state.selectedGroupByFields = payload.groupBy;

                // active chart and close modal
                state.chartInfo.chartType = payload.chartType;

                state.chartInfo.isActiveChart = true;
                state.chartInfo.isActiveModal = false;
            })
            .addCase(addReportGroupBy.rejected, (state, { payload }) => {
                state.isLoading = false;
            })

            // remove chart
            .addCase(removeChart.pending, state => {
                state.isLoading = true;
            })
            .addCase(removeChart.fulfilled, (state, { payload }) => {
                state.isLoading = false;

                state.chartInfo.chartType = null;
                state.chartInfo.isActiveChart = false;

                state.selectedGroupByFields = null;
            })
            .addCase(removeChart.rejected, (state, { payload }) => {
                state.isLoading = false;
            })
            .addCase(onPublic.pending, state => {
                state.isLoading = true;
            })
            .addCase(onPublic.fulfilled, (state, { payload }) => {
                state.isPublic = payload?.isPublic || false;
                state.isLoading = false;
            })
            .addCase(onPublic.rejected, (state, { payload }) => {
                state.isLoading = false;
            });
    }
});

export default reportSlice.reducer;
export const {
    loadFolders,
    updateStep,
    loadFilters,
    activeModal,
    activeChart,
    loadChartData
} = reportSlice.actions;
