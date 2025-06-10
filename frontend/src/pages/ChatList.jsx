import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatRoom from './ChatRoom';

const ChatList = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchChats = async () => {
            if (!currentUser?._id) return;
            try {
                const { data } = await axios.get(`${backendUrl}/api/chats/my/${currentUser._id}`);
                setChats(data);
            } catch (error) {
                console.error('Failed to load chats', error);
            }
        };

        fetchChats();
    }, [currentUser]);

    const handleChatClick = (chat) => {
        setSelectedChat(chat);

    };

    return (
        <div className="flex h-screen max-h-screen border rounded-lg overflow-hidden">
            {/* Left - Chat List */}
            <div className="basis-1/3 bg-gray-50 border-r overflow-y-auto">


                <div className="overflow-y-auto h-full">
                    {chats.length === 0 ? (
                        <p className="text-gray-500 p-4">No chats yet.</p>
                    ) : (
                        <div>
                            {chats.map((chat, index) => {
                                const otherUser = chat.participants.find((p) => p._id !== currentUser._id);

                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => handleChatClick(chat)}
                                        className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-200 cursor-pointer border-b transition-all duration-150 ${selectedChat?._id === chat._id ? "bg-gray-100" : "bg-white"
                                            }`}
                                    >
                                        <img
                                            src={otherUser?.avatar || "/default-avatar.png"}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h2 className="font-medium text-gray-800 truncate">
                                                {otherUser?.username || "User"}
                                            </h2>
                                            <p className="text-sm text-gray-500 truncate">
                                                {chat.lastMessage || "No messages yet."}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(chat.lastUpdated).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Right - Chat Room */}
            <div className="basis-2/3 bg-white flex flex-col overflow-y-auto">
                {selectedChat ? (
                    <ChatRoom
                        receiverUser={selectedChat.participants.find((p) => p._id !== currentUser._id)}
                        chatRoomId={selectedChat._id}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
