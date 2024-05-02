import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    color: 'bg-red-500 text-red-500',
    font: 'text-sm',
    text: ''
}

const testSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateColor: (state, { payload }) => {
            state.color = payload
        },
        updateFont: (state, { payload }) => {
            state.font = payload
        },
        updateText: (state, { payload }) => {
            state.text = payload
        }
    }
})

export default testSlice.reducer
export const { updateColor, updateFont, updateText } = testSlice.actions
