import { useState, useEffect, useRef } from "react";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoSend, IoClose } from "react-icons/io5";
import ChatIcon from "../assets/Images/ChatApplicationIcon.jpg";
import { useSelector, useDispatch } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router";
import axios from "axios";
import { setMessages, addMessage } from "../Redux/Slices/MessageSlice";



function ChatScreen() {

    const [messageInTyping, seMessageInTyping] = useState("");
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [currMessages, setCurrMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const selectedUserRef = useRef(selectedUser);
    const [users, setUsers] = useState([]);
    const [currstompClient, setStompClient] = useState(null);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const baseURL = import.meta.env.VITE_API_URL;
    let intervalId; // To track the interval

    const { currentUserName, currentUserEmail, currentUserPhone, currentUserId } = useSelector((state) => state.user);
    const { AllMessages } = useSelector((state) => state.chat);


    // For toggling the User Details Panel
    const toggleUserDetails = () => {
        setShowUserDetails(!showUserDetails);
    };

    const fetchChatHistory = async (chatPartnerEmail) => {
        const filteredMessages = AllMessages.filter(
            msg => msg.senderEmail === chatPartnerEmail || msg.receiverEmail === chatPartnerEmail
        );

        console.log("Number of Messages for Selected User: ", filteredMessages.length);
        setCurrMessages(filteredMessages);
    };

    // When a user is selected, this function will be called to set the selected user and fetch the chat history.
    const handleSeletedUser = (selectedUserEmail) => {
        console.log("Selected User: ", selectedUserEmail);
        setSelectedUser(selectedUserEmail);
        fetchChatHistory(selectedUserEmail.email);
    }

    // This fucntion will fetch all the users to be listed on the Page.
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

    // This function will used to fetch all the messages from the server.
    const fetchAllChats = async (currentUserEmail) => {
        try {
            const response = await axios.get(`${baseURL}/chats/all`, {
                params: { email: currentUserEmail } // ✅ Pass email as a query param
            });

            if (response.status === 200) {
                console.log("Here are the list of all messages:");
                dispatch(setMessages(response.data.data));
            }
        } catch (error) {
            console.error("Error fetching all chats:", error);
        }
    };

    useEffect(() => {
        if (!currentUserEmail || !currentUserName || !currentUserPhone || !currentUserId) {
            navigate("/");
            return;
        }

        // Check if WebSocket is already connected
        if (currstompClient && currstompClient.connected) {
            console.log("WebSocket already connected. Skipping re-initialization.");
            return;
        }

        // ================== WebSocket Connection ==================
        const socket = new SockJS(`http://localhost:8080/ws?user-email=${encodeURIComponent(currentUserEmail)}`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");
                stompClient.subscribe(`/topic/chat-${currentUserEmail}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    if (receivedMessage.receiverEmail === currentUserEmail && receivedMessage.senderEmail === selectedUserRef.current?.email) {
                        setCurrMessages((prevMessages) => [...prevMessages, receivedMessage]);
                        dispatch(addMessage(receivedMessage));
                    }
                });
            },
        });

        stompClient.activate();
        setStompClient(stompClient); // Store the stomp client in state
        fetchAllChats(currentUserEmail);

        // ================== Fetch Users Every 5 Seconds ==================
        intervalId = setInterval(fetchAllUsers, 5000);

        // Cleanup function
        return () => {
            console.log("Disconnecting WebSocket");
            if (stompClient) {
                stompClient.deactivate();
            }
            clearInterval(intervalId);
        };
    }, [currentUserEmail]);

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

            setCurrMessages((prevMessages) => [...prevMessages, msgObject]);
            dispatch(addMessage(msgObject));
        } else {
            console.error("STOMP client is not connected.");
        }
    };

    const findLastMessage = (UserEmail) => {
        let lastMessage =  AllMessages.findLast(
            msg =>
                (msg.senderEmail === currentUserEmail && msg.receiverEmail === UserEmail) ||
                (msg.senderEmail === UserEmail && msg.receiverEmail === currentUserEmail)
        ) || null; // Return null if no message is found

        if(lastMessage){
            return lastMessage.content;
        }else{
            return null;
        }
        

    }


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

    const chatContainerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Scroll to bottom when new message arrives
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [currMessages]);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    // Handle scroll event
    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            setShowScrollButton(scrollHeight - scrollTop > clientHeight + 100); // Show button if user scrolled up
        }
    };

    // Scroll to bottom when button is clicked
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        setShowScrollButton(false);
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
                            <div key={index} className={`flex items-center ${selectedUser && user.email == selectedUser.email ? "bg-gray-200" : ""} p-2 cursor-pointer`} onClick={() => handleSeletedUser(user)}>
                                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500">{findLastMessage(user.email)}</p>
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
                    <div className="flex-1 p-4 bg-gray-200 overflow-y-auto custom-scrollbar" ref={chatContainerRef} onScroll={handleScroll}>
                        {currMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.senderEmail == currentUserEmail ? "justify-end" : "justify-start"} mb-2`}>
                                <div className={`p-3 max-w-xs rounded-lg ${msg.senderEmail == currentUserEmail ? "bg-blue-400 text-white" : "bg-white text-black"}`}>
                                    {msg.content}
                                    <div className="text-xs text-right opacity-70 mt-1">{formatMessageTime(msg.timestamp)}</div>
                                </div>
                            </div>
                        ))}
                        {/* Scroll to Bottom Button - Positioned Above the Input Field */}
                        {showScrollButton && (
                            <button
                                onClick={scrollToBottom}
                                className="absolute right-6 bottom-[72px] bg-gray-400 text-white px-3 py-1 rounded-full shadow-lg"
                            >
                                ↓
                            </button>
                        )}
                    </div>
                    <div className="p-4 bg-gray-200 flex items-center">
                        <div className="w-full flex items-center bg-white rounded-3xl">
                            <textarea
                                rows={1}
                                type="text"
                                placeholder="Type a message..."
                                className="w-full p-2 max-h-24 rounded-3xl resize-none overflow-y-auto focus:outline-none custom-scrollbar"
                                value={messageInTyping}
                                onChange={(e) => {
                                    seMessageInTyping(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault(); // Prevents new line
                                        sendMessage(messageInTyping, selectedUser);
                                        seMessageInTyping(""); // Clear input after sending
                                    }
                                }}
                            />
                            <button
                                className="ml-2 text-[#a7d9f2] p-2 rounded-md"
                                onClick={() => {
                                    sendMessage(messageInTyping, selectedUser);
                                    seMessageInTyping("");
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
