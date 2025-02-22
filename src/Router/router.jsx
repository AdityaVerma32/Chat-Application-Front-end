import React from "react";
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Register from "../Pages/Register.jsx";
import ChatScreen from "../Pages/ChatScreen.jsx";
import Layout from "../Layout/layout.jsx";
import Login from "../Pages/Login.jsx";



export const route = createBrowserRouter(
    createRoutesFromElements(
        <React.Fragment>
            <Route path="/" element={<Layout />}>
                <Route path="" element={<Register />} />
                <Route path="/chat" element={<ChatScreen />} />
                <Route path="/login" element={<Login />} />
            </Route>
        </React.Fragment >
    )
)