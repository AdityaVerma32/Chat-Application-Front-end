import { useState } from "react";
import React from "react";
import ChatIcon from "../assets/Images/ChatApplicationIcon.jpg";

const Login = ({ onLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ name, email, phone });
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[#a7d9f2]">
            <div className="relative bg-white p-8 rounded-lg shadow-lg w-96">
                {/* Top right dots */}
                <div className="absolute top-2 right-2 grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div>
                    ))}
                </div>
                {/* Bottom left dots */}
                <div className="absolute bottom-2 left-2 grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div>
                    ))}
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
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                {/* Sign Up Button */}
                <button className="w-full bg-gray-600 text-white p-2 rounded">Sign Up</button>
            </div>
        </div>
    );
};

export default Login;
