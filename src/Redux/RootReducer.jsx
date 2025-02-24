import userReducer from "./Slices/userSlice";
import { combineReducers } from "redux";
import messageReducer from "./Slices/MessageSlice";

const rootReducer = combineReducers({
    user: userReducer,
    chat: messageReducer
})

export default rootReducer;