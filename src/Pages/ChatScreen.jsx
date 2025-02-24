import { useState, useEffect } from "react";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoSend, IoClose } from "react-icons/io5";
import ChatIcon from "../assets/Images/ChatApplicationIcon.jpg";
import { useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router";
import axios from "axios";



function ChatScreen() {

    const [messages, setMessages] = useState([]);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const { currentUserName, currentUserEmail, currentUserPhone, currentUserId } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_URL;
    const [users, setUsers] = useState([]);
    const [currstompClient, setStompClient] = useState(null);


    const toggleUserDetails = () => {
        setShowUserDetails(!showUserDetails);
    };

    const fetchChatHistory = async (chatPartnerEmail) => {
        try {
            console.log("Fetching chat history for:", chatPartnerEmail);
            axios.get(`${baseURL}/chat/history/${currentUserEmail}/${chatPartnerEmail}`)
                .then((response) => {
                    console.log("Chat History:", response.data.data);
                    setMessages(response.data.data);
                })


        } catch (error) {
            console.error("Error fetching chat history:", error);
        }
    };

    const handleSeletedUser = (selectedUserEmail) => {
        setSelectedUser(selectedUserEmail);
        fetchChatHistory(selectedUserEmail.email);
    }

    const fetchAllUsers = async () => {
        try {
            axios.post(`${baseURL}/getAllUsers`, { email: currentUserEmail })
                .then((response) => {
                    // Handle the response data here
                    if (response.status === 200) {
                        setUsers(response.data.data);
                    }
                })
        } catch (error) {
            console.error("Error fetching all users:", error);
        }
    }

    useEffect(() => {

        if (!currentUserEmail || !currentUserName || !currentUserPhone || !currentUserId) {
            navigate("/");
        }

        // Check if a WebSocket connection already exists
        if (currstompClient && currstompClient.connected) {
            console.log("WebSocket already connected. Skipping re-initialization.");
            return;
        }

        // ================== Websocket ==================
        const socket = new SockJS(`http://localhost:8080/ws?user-email=${encodeURIComponent(currentUserEmail)}`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            // debug: (str) => {
            //     console.log(str);
            // },
            reconnectDelay: 5000,
            // heartbeatIncoming: 4000,
            // heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log("Connected to WebSocket");
                // Subscribe to the user-specific queue for receiving messages
                stompClient.subscribe(`/topic/chat-${currentUserEmail}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    console.log("Message received: ", receivedMessage);
                    if (receivedMessage.receiverEmail == currentUserEmail) {

                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    }

                });
            },
        });
        // Connect WebSocket
        stompClient.activate();
        setStompClient(stompClient);

        fetchAllUsers();
        return () => {  // Cleanup function
            console.log("Disconnecting WebSocket");
            stompClient.deactivate();
        };
        // ================== Websocket ==================


    }, [currentUserEmail])

    const sendMessage = (message, toUser) => {

        if (currstompClient && currstompClient.connected) {
            const msgObject = {
                senderEmail: currentUserEmail,
                receiverEmail: toUser.email,
                content: message,
                timestamp: new Date(),
            };

            currstompClient.publish({
                destination: "/app/chat",
                body: JSON.stringify(msgObject),
            });

            setMessages([...messages, msgObject]);
            console.log("Message sent:", msgObject);
        } else {
            console.error("STOMP client is not connected.");
        }
    };


    const formatMessageTime = (timestamp) => {
        const messageDate = new Date(timestamp);
        const now = new Date();

        const isToday = messageDate.toDateString() === now.toDateString();
        const isYesterday = messageDate.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();

        if (isToday) {
            return messageDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        } else if (isYesterday) {
            return "Yesterday";
        } else {
            return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
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
                    {users && users.length > 0 ? (users.map(
                        (user, index) => (
                            <div key={index} className={`flex items-center ${selectedUser && user.email == selectedUser.email? "bg-gray-200": ""} p-2 cursor-pointer`} onClick={() => handleSeletedUser(user)}>
                                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500">Last message...</p>
                                </div>
                            </div>
                        )
                    )) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No users found
                        </div>
                    )}
                </div>
            </div>

            {/* Chat & User Details Container */}
            <div className="flex flex-1 bg-white border-l border-gray-300">
                {/* Chat Section */}
                {selectedUser ? (<div className={`flex flex-col transition-all duration-300 ${showUserDetails ? "w-3/4" : "w-full"}`}>
                    <div className="flex p-2 border-b border-gray-300 text-lg font-semibold cursor-pointer" onClick={toggleUserDetails}>
                        <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                            {selectedUser.name.charAt(0)}
                        </div>
                        <div className="ml-2 mt-1.5">
                            {selectedUser.name}
                        </div>
                    </div>
                    <div className="flex-1 p-4 bg-gray-200 overflow-y-auto custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.senderEmail == currentUserEmail ? "justify-end" : "justify-start"} mb-2`}>
                                <div className={`p-3 max-w-xs rounded-lg ${msg.senderEmail == currentUserEmail ? "bg-blue-400 text-white" : "bg-white text-black"}`}>
                                    {msg.content}
                                    <div className="text-xs text-right opacity-70 mt-1">{formatMessageTime(msg.timestamp)}</div>
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
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault(); // Prevents new line
                                        sendMessage(message, selectedUser);
                                        setMessage(""); // Clear input after sending
                                    }
                                }}
                            />
                            <button
                                className="ml-2 text-[#a7d9f2] p-2 rounded-md"
                                onClick={() => {
                                    sendMessage(message, selectedUser);
                                    setMessage("");
                                }}>
                                <IoSend size={20} />
                            </button>
                        </div>
                    </div>
                </div>) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-white bg-gray-200">
                        <img
                            src={ChatIcon}
                            alt="Chat Application Logo"
                            className="w-16 h-16 mb-4"
                        />
                        <div className="text-2xl text-gray-400 font-semibold">Download ChatApp for Windows</div>
                        <p className="text-black text-sm text-center mt-2 px-6">
                            Make calls, share your screen, and get a faster experience when you download the Windows app.
                        </p>
                        <p className="text-gray-500 text-xs mt-8">Your personal messages are end-to-end encrypted</p>
                    </div>
                )}


                {/* User Details Panel */}
                {showUserDetails && selectedUser && (
                    <div className="w-1/4 bg-white shadow-lg border-l border-gray-300 p-4 transition-all duration-300">
                        <button className="absolute top-6 right-6" onClick={toggleUserDetails}>
                            <IoClose size={20} />
                        </button>
                        <div className="flex flex-col items-center mt-8">
                            <div className="w-30 h-30 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                                D
                            </div>
                            <h2 className="mt-2 text-lg font-bold">{selectedUser.name}</h2>
                            <p className="text-gray-500">{selectedUser.phone}</p>
                            <p className="text-gray-500">{selectedUser.email}</p>
                        </div>
                        <hr className="text-gray-300 mt-4" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatScreen
