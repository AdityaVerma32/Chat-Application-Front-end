import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    AllMessages: []
}


const messageSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.AllMessages = action.payload.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        },
        addMessage: (state, action) => {
            state.AllMessages.push(action.payload);
            state.AllMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        }
    }
})

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;