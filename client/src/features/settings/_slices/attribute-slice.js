import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { saveGroupAttributeSetting } from '../_services/manage-attribute-service';

const initialState = {
    isLoading: false,

    groups: [],
    groupSelected: null,
    groupEditing: null,
    isOpenGroupModal: false,

    attributes: [],
    attributeEditing: null,
    isOpenAttributeModal: false
};

// Add subordinate
export const onSaveSetting = createAsyncThunk(
    // Type
    'manage-group-attribute/save',
    // payload creator
    async (formData, { rejectWithValue }) => {
        try {
            // Call API to add new subordinate for employee
            const res = await saveGroupAttributeSetting(formData);

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

const attributeSlice = createSlice({
    name: 'group - attributes',
    initialState,
    reducers: {
        // Loading
        setLoading: (state, { payload }) => {
            state.isLoading = payload;
        },

        // Modal
        activeGroupModal: (state, { payload }) => {
            state.isOpenGroupModal = payload;
        },
        activeAttributeModal: (state, { payload }) => {
            state.isOpenAttributeModal = payload;
        },

        // Groups
        groupsReceived: (state, { payload }) => {
            state.groups = payload;
        },
        groupReceived: (state, { payload }) => {
            state.groupSelected = payload;
        },
        groupEditingReceived: (state, { payload }) => {
            state.groupEditing = payload;
        },
        groupAddNewReceived: (state, { payload }) => {
            state.groups = [...state.groups, payload];
        },
        groupUpdateReceived: (state, { payload }) => {
            let modified = state.groups?.map(group => {
                if (group.id === payload.id) {
                    return { ...payload, order: group.order };
                } else {
                    return group;
                }
            });
            state.groups = modified;
        },

        // Attributes
        attributesReceived: (state, { payload }) => {
            state.attributes = payload;
        },
        attributeEditingReceived: (state, { payload }) => {
            state.attributeEditing = payload;
        },
        attributeAddNewReceived: (state, { payload }) => {
            state.attributes = [...state.attributes, payload];
        },
        attributeUpdateReceived: (state, { payload }) => {
            console.log(payload);
            let modified = state.attributes?.map(attribute => {
                if (attribute.id === payload.id) {
                    return { ...payload, order: attribute.order };
                } else {
                    return attribute;
                }
            });
            state.attributes = modified;
        }
    },
    extraReducers: builder => {
        builder
            // Handle save settings
            .addCase(onSaveSetting.pending, state => {
                state.isLoading = true;
            })
            .addCase(onSaveSetting.fulfilled, (state, { payload }) => {
                state.isLoading = false;
            })
            .addCase(onSaveSetting.rejected, (state, { payload }) => {
                state.isLoading = false;
            });
    }
});

export default attributeSlice.reducer;
export const {
    setLoading,

    activeGroupModal,
    activeAttributeModal,

    groupsReceived,
    groupReceived,
    groupEditingReceived,
    groupAddNewReceived,
    groupUpdateReceived,

    attributesReceived,
    attributeEditingReceived,
    attributeAddNewReceived,
    attributeUpdateReceived
} = attributeSlice.actions;
