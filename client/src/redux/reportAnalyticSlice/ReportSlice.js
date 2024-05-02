import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    addFolderAPI,
    addReportGroupByAPI,
    getCurrentReportDefinition
} from '@/api/reportAnalysisAPI'
import { showNotification } from '../../utils/utils'

import axios from '@/api/axios/axiosInstance'

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
}

// Function to add new report folder
export const addFolder = createAsyncThunk(
    'report-analysis/add-folder',
    async (formData, { rejectWithValue }) => {
        try {
            // call api to add new folder
            const { status, data } = await addFolderAPI(formData)
            if (status === 201) {
                return data
            } else {
                return rejectWithValue(data)
            }
        } catch (err) {
            console.log(err)
        }
    }
)

export const loadDefinition = createAsyncThunk(
    // type
    'report-analysis/load-definition',
    async (reportId, { rejectWithValue }) => {
        try {
            // Call api to fecth report definition by report id
            const { status, data, meta } = await getCurrentReportDefinition(
                reportId
            )
            if (status === 200) {
                return { data, meta }
            } else {
                return rejectWithValue({
                    data,
                    meta
                })
            }
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const deleteReport = createAsyncThunk(
    //
    'report/remove-report',
    async (formData, { rejectWithValue }) => {
        try {
            // call api to save the group by
            const res = await removeReport(formData)
            if (res.status === 201) {
                const { data } = res
                return data
            } else {
                console.log(res)
                return rejectWithValue(res)
            }
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

export const saveReport = createAsyncThunk(
    // type
    'report-analysis/save-report',
    async (formData, { rejectWithValue }) => {
        try {
            // call api to save the group by

            let url = '/reports/definition/add'
            const { id } = formData
            if (id) {
                url = `/reports/definition/${id}/update`
            }

            const {
                data: { status, data }
            } = await axios.post(url, formData)
            if (status === 201) {
                return data
            } else {
                console.log(data)
                return rejectWithValue(data)
            }
        } catch (err) {
            return rejectWithValue(err)
        }
    }
)

const reportSlice = createSlice({
    name: 'analysis',
    initialState,
    reducers: {
        loadFolders: (state, action) => {
            state.folders = action.payload
        },
        // Set curent id of folder edit
        setFolderIdEditing: (state, action) => {
            state.currentFolderIdEditing = action.payload
        },

        updateStep: (state, action) => {
            state.currentStep = state.currentStep + action.payload
        },
        loadFilters: (state, action) => {
            state.selectedFilters = action.payload
        },
        activeModal: (state, action) => {
            state.isActiveModal = action.payload
        },
        loadChartData: (state, action) => {
            state.chartInfo.records = action.payload.records
            state.chartInfo.headers = action.payload.headers
            state.chartInfo.chartType = action.payload.chartType
        }
    },
    extraReducers: builder => {
        builder
            // Add FOLDER
            .addCase(addFolder.pending, state => {})
            .addCase(addFolder.fulfilled, (state, { payload }) => {
                state.folders = [...state.folders, payload]
            })
            .addCase(addFolder.rejected, (state, { payload }) => {})

            // LOAD DEFINITION
            // Load definition by report id
            .addCase(loadDefinition.pending, state => {
                // Turn on loading
                state.isLoading = true
            })
            .addCase(loadDefinition.fulfilled, (state, { payload }) => {
                // set data
                state.currentId = payload.data.id
                state.folderId = payload.data.folderId
                state.reportName = payload.data.name
                state.selectedDisplayFields = payload.data.selectedDisplayFields
                state.selectedFilters = payload.data.selectedFilters
                state.selectedGroupByFields = payload.data.selectedGroupByFields

                // Set meta data
                state.availableDisplayGroups =
                    payload.meta.availableDisplayGroups
                state.availableFilterGroups = payload.meta.availableFilterGroups
                state.availableFilters = payload.meta.availableFilters

                // Turn Off loading
                state.isLoading = false
            })
            .addCase(loadDefinition.rejected, (state, { payload }) => {
                // Turn Off loading
                state.isLoading = false
            })

            .addCase(deleteReport.pending, state => {})
            .addCase(deleteReport.fulfilled, (state, { payload }) => {
                state.folders = [...state.folders, payload]
            })
            .addCase(deleteReport.rejected, (state, { payload }) => {})

            // Save report
            .addCase(saveReport.pending, state => {
                state.isLoading = true
            })
            .addCase(saveReport.fulfilled, (state, { payload }) => {
                state.isLoading = false
            })
            .addCase(saveReport.rejected, (state, { payload }) => {
                state.isLoading = false
            })
    }
})

export default reportSlice.reducer
export const {
    loadFolders,
    updateStep,
    loadFilters,
    activeModal,
    loadChartData
} = reportSlice.actions
