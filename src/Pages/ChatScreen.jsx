import { useState } from "react";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoSend, IoClose } from "react-icons/io5";
import ChatIcon from "../assets/Images/ChatApplicationIcon.jpg";

function ChatScreen() {

    const [messages, setMessages] = useState([
        { sender: "other", text: "OMG do you remember what you did last night at the work night out?", time: "8:12 am" },
        { sender: "me", text: "no haha", time: "18:16" },
        { sender: "me", text: "i don’t remember anything", time: "18:16" }
    ]);
    const [showUserDetails, setShowUserDetails] = useState(false);

    const toggleUserDetails = () => {
        setShowUserDetails(!showUserDetails);
    };


    const [message, setMessage] = useState("");

    const sendMessage = () => {
        if (!message.trim()) return;
        setMessages([...messages, { sender: "me", text: message, time: "Now" }]);
        setMessage("");
    };


    return (
        <div className="flex w-full h-full p-4">
            {/* Sidebar */}
            <div className="w-1/4 bg-white flex flex-col">
                {/* Header Section */}
                <div className="px-4 pt-3">
                    <div className="flex items-center mb-4">
                        <div className=" flex text-2xl font-inter">
                            <img src={ChatIcon} alt="Chat Application" className="w-10 h-10 p-1" />
                            <div className="pt-1 ml-1">
                                chat
                            </div>
                        </div>
                    </div>
                    {/* Search Input */}
                    <div className="flex items-center bg-gray-100 p-2 rounded-3xl mb-2">
                        <FaSearch className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="ml-2 bg-transparent focus:outline-none"
                        />
                    </div>
                </div>
                {/* Scrollable Chat List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar" >
                    {["Jessica Drew", "David Moore", "Greg James", "Emily Dorson", "Office Chat", "Little Sister", "Aditya Verma", "Shourya Verma", "Pradeep Verma", "Bindiya Verma"].map(
                        (name, index) => (
                            <div key={index} className={`flex ${index == 3 ? "bg-gray-100" : ""} items-center p-2 cursor-pointer`}>
                                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                                    {name.charAt(0)}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{name}</p>
                                    <p className="text-xs text-gray-500">Last message...</p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Chat & User Details Container */}
            <div className="flex flex-1 bg-white border-l border-gray-300">
                {/* Chat Section */}
                <div className={`flex flex-col transition-all duration-300 ${showUserDetails ? "w-3/4" : "w-full"}`}>
                    <div className="flex p-2 border-b border-gray-300 text-lg font-semibold cursor-pointer" onClick={toggleUserDetails}>
                        <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                            D
                        </div>
                        <div className="ml-2 mt-1.5">
                            David Moore
                        </div>
                    </div>
                    <div className="flex-1 p-4 bg-gray-200 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} mb-2`}>
                                <div className={`p-3 max-w-xs rounded-lg ${msg.sender === "me" ? "bg-blue-400 text-white" : "bg-white text-black"}`}>
                                    {msg.text}
                                    <div className="text-xs text-right opacity-70 mt-1">{msg.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-200 flex items-center">
                        <div className="w-full flex items-center bg-white rounded-3xl">
                            <textarea
                                rows={1}
                                type="text"
                                placeholder="Type a message..."
                                className="w-full p-2 max-h-24 rounded-3xl resize-none overflow-y-auto focus:outline-none custom-scrollbar"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
                                }}
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button className="ml-2 text-[#a7d9f2] p-2 rounded-md" onClick={sendMessage}>
                                <IoSend size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* User Details Panel */}
                {showUserDetails && (
                    <div className="w-1/4 bg-white shadow-lg border-l border-gray-300 p-4 transition-all duration-300">
                        <button className="absolute top-6 right-6" onClick={toggleUserDetails}>
                            <IoClose size={20} />
                        </button>
                        <div className="flex flex-col items-center mt-8">
                            <div className="w-30 h-30 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                                D
                            </div>
                            <h2 className="mt-2 text-lg font-bold">Daina Moore</h2>
                            <p className="text-gray-500">+032165487924</p>
                            <p className="text-gray-500">dianamoore@gmail.com</p>
                        </div>
                        <hr className="text-gray-300 mt-4" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatScreen
