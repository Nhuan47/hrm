import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '../_services/salary-service';

const initialState = {
    fields: [],
    salaries: [],
    currentIdEditing: null
};

export const addEmployeeSalary = createAsyncThunk(
    'salary/add',
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to add the assign attachment file
            let res = await api.addSalaryItem(formData);
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

export const updateEmployeeSalary = createAsyncThunk(
    'salary/update',
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to add the assign attachment file
            let res = await api.updateSalaryItem(formData);
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

export const deleteEmployeeSalary = createAsyncThunk(
    'salary/delete',
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to add the assign attachment file
            let res = await api.deleteSalaryItem(formData);
            let { data, status } = res;
            if (status === 200) {
                return data;
            } else {
                return rejectWithValue(res);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const loadSalaryHistories = createAsyncThunk(
    'salary/load-salary-histories',
    async (employeeId, { rejectWithValue }) => {
        try {
            // Call API to add the assign attachment file
            let res = await api.getSalaryItems(employeeId);
            if (res.status === 200) {
                return res.data;
            } else {
                return rejectWithValue(res);
            }
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const salarySlice = createSlice({
    name: 'salary',
    initialState,
    reducers: {
        loadFields: (state, { payload }) => {
            state.fields = payload;
        },

        loadItemEditing: (state, { payload }) => {
            state.currentIdEditing = payload;
        }
    },
    extraReducers: builder => {
        builder
            // Handle reducer to add attachment file
            .addCase(addEmployeeSalary.pending, state => {
                state.isLoading = true;
            })
            .addCase(addEmployeeSalary.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                let items = [...state.salaries, payload];
                state.salaries = items.sort((a, b) => {
                    const dateA = new Date(
                        a.salaryName?.replace(/(\d{2})-(\d{4})/, '$2-$1')
                    );
                    const dateB = new Date(
                        b.salaryName?.replace(/(\d{2})-(\d{4})/, '$2-$1')
                    );

                    return dateA - dateB;
                });
            })
            .addCase(addEmployeeSalary.rejected, (state, { payload }) => {
                state.isLoading = false;
            })

            // Handle reducer to add attachment file
            .addCase(updateEmployeeSalary.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateEmployeeSalary.fulfilled, (state, { payload }) => {
                state.isLoading = false;

                let items = state.salaries?.map(salary =>
                    salary.id === payload.id ? payload : salary
                );

                state.salaries = items.sort((a, b) => {
                    const dateA = new Date(
                        a.salaryName?.replace(/(\d{2})-(\d{4})/, '$2-$1')
                    );
                    const dateB = new Date(
                        b.salaryName?.replace(/(\d{2})-(\d{4})/, '$2-$1')
                    );

                    return dateA - dateB;
                });
            })
            .addCase(updateEmployeeSalary.rejected, (state, { payload }) => {
                state.isLoading = false;
            })

            // Load editing
            .addCase(loadSalaryHistories.pending, state => {
                state.isLoading = true;
            })
            .addCase(loadSalaryHistories.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.salaries = [...payload];
            })
            .addCase(loadSalaryHistories.rejected, (state, { payload }) => {
                state.isLoading = false;
            })

            // Delete
            .addCase(deleteEmployeeSalary.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteEmployeeSalary.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.salaries = state.salaries.filter(
                    salary => salary.id !== +payload.id
                );
            })
            .addCase(deleteEmployeeSalary.rejected, (state, { payload }) => {
                state.isLoading = false;
            });
    }
});

export default salarySlice.reducer;
export const { loadFields, loadItemEditing } = salarySlice.actions;
