import React, { useState } from "react";
import ChatIcon from "../assets/Images/ChatApplicationIcon.jpg";
import DotsUI from "../Components/DotsUI";
import { Link } from 'react-router-dom';
import axios from "axios";

const Register = () => {


    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: ""
    })
    const baseURL = import.meta.env.VITE_API_URL;
    const registerUser = () => {
        if (user.name === "" || user.email === "" || user.phone === "") {
            alert("Please fill all the fields");
        } else {
            axios.post(`${baseURL}/register`, user)
                .then((response) => {
                    if(response.status === 200){
                        setUser({
                            name: "",
                            email: "",
                            phone: ""
                        })
                        alert("User Registered Successfully");
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
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    value={user.name}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    value={user.email}
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    value={user.phone}
                />
                {/* Sign Up Button */}
                <button
                    className="w-full bg-gray-600 text-white p-2 rounded"
                    onClick={registerUser}
                >Sign Up</button>
                {/* Register Link */}
                <p className="text-sm text-center text-gray-500 mt-3">
                    Already have an account?{" "}
                    <Link to="/Login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
