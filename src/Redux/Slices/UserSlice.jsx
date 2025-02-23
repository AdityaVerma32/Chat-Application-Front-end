import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUserName: "",
    currentUserEmail: "",
    currentUserPhone: "",
    currentUserId: ""
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.currentUserName = action.payload.name;
            state.currentUserEmail = action.payload.email;
            state.currentUserPhone = action.payload.phone;
            state.currentUserId = action.payload.id;
        },
        unsetUser: (state) => {
            state.currentUserEmail = "";
            state.currentUserId = "";
            state.currentUserName = "";
            state.currentUserPhone = "";
        }
    }
})

export const { setUser, unsetUser } = userSlice.actions;
export default userSlice.reducer;