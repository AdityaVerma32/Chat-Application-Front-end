import React, { useState } from 'react';
import ChatIcon from "../assets/Images/ChatApplicationIcon.jpg";
import DotsUI from "../Components/DotsUI";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/Slices/userSlice';
import { useNavigate } from 'react-router-dom';

function Login() {


    const baseURL = import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        if (email === "") {
            alert("Please enter email");
        } else {
            axios.post(`${baseURL}/login`, { email })
                .then((response) => {
                    if (response.status === 200) {
                        setEmail("");
                        dispatch(setUser(response.data.data));
                        navigate("/chat");
                    }
                })
                .catch((error) => {
                    console.log(error);
                })

        }
    }

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="relative bg-white p-8 rounded-lg shadow-lg w-96 item-center justify-center">
                {/* Top right dots */}
                <div className="absolute top-2 right-2 grid grid-cols-3 gap-1">
                    <DotsUI />
                </div>
                {/* Bottom left dots */}
                <div className="absolute bottom-2 left-2 grid grid-cols-3 gap-1">
                    <DotsUI />
                </div>
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <div className="text-2xl flex items-center font-inter">
                        <img src={ChatIcon} alt="Chat Application" className="w-10 h-10 p-1" />
                        <div>
                            chat
                        </div>
                    </div>
                </div>
                {/* Input Fields */}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                {/* Sign Up Button */}
                <button
                    className="w-full bg-gray-600 text-white p-2 rounded"
                    onClick={handleLogin}
                >Enter Chat</button>
                {/* Register Link */}
                <p className="text-sm text-center text-gray-500 mt-3">
                    Don't have an account?{" "}
                    <Link to="/" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
