import { createSlice } from '@reduxjs/toolkit'

export const connectedSlice = createSlice({
    name: 'connected',
    initialState: {
        isConnected: false,
    },
    reducers: {
        setConnected: state => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.isConnected = true
        },
        setDisconnected: state => {
            state.isConnected = false
        },
    }
})

// Action creators are generated for each case reducer function
export const { setConnected, setDisconnected } = connectedSlice.actions

export default connectedSlice.reducer
