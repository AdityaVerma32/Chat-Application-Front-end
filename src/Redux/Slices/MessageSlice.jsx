import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    message: {}
}


const messageSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {

        // Load Previous Chat History from DB
        loadChatHistory: (state, action) => {
            const { userEmail, messages } = action.payload;
            state.message[userEmail] = messages;
        },

        // Add a new received message
        receiveMessage: (state, action) => {
            const { senderEmail, message } = action.payload;

            if(!state.message[senderEmail]){
                state.message[senderEmail] = [];
            }
            state.message[senderEmail] = [...state.message[senderEmail], message]; // Append the message to sender's Chat
        },

        // Send a new message
        sendMessage: (state, action) => {
            const { receiverEmail, message } = action.payload;

            if(!state.message[receiverEmail]){
                state.message[receiverEmail] = [];
            }
            state.message[receiverEmail] = [...state.message[receiverEmail], message]; // Append the message to receiver's Chat
        }

    }
})

// Export the actions
export const { loadChatHistory, receiveMessage, sendMessage } = messageSlice.actions;

// Export the reducer
export default messageSlice.reducer;