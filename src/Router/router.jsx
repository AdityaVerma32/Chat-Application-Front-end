import React from "react";
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router";
import Login from "../Pages/Login";
import ChatScreen from "../Pages/ChatScreen";


export const route = createBrowserRouter(
    createRoutesFromElements(
        <React.Fragment>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<ChatScreen />} />
        </React.Fragment>
    )
)