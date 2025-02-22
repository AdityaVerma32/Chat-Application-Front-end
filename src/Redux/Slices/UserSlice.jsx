import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    email: "",
    phone: "",
    id: ""
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.id = action.payload.id;
        },
        unsetUser: (state) => {
            state.name = "";
            state.email = "";
            state.phone = "";
            state.id = "";
        }
    }
})

export const { setUser, unsetUser } = userSlice.actions;
export default userSlice.reducer;