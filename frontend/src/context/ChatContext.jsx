import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket";
import { useSelector } from "react-redux";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { currentUser } = useSelector((state) => state.user);

    const [chatRooms, setChatRooms] = useState([]);
    const [messages, setMessages] = useState({});
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const API = axios.create({
        baseURL: "https://regalia-estates.onrender.com/api",
        withCredentials: true,
    });

    // Fetch all my chatrooms
    const fetchChats = async () => {
        try {
            setLoadingChats(true);
            const res = await API.get(`/chats/my/${currentUser._id}`);
            setChatRooms(res.data);
        } catch (err) {
            console.error("Failed to load chats", err);
        } finally {
            setLoadingChats(false);
        }
    };

    // Fetch messages for a room
    const fetchMessages = async (chatRoomId) => {
        try {
            setLoadingMessages(true);
            const res = await API.get(`/chats/${chatRoomId}/messages`);
            setMessages((prev) => ({
                ...prev,
                [chatRoomId]: res.data,
            }));
        } catch (err) {
            console.error("Failed to load messages", err);
        } finally {
            setLoadingMessages(false);
        }
    };

    // Start a chat with another user (creates chatRoom if not exists)
    const startChatWithUser = async (userId2) => {
        try {
            const res = await API.post(`/chats/start`, {
                userId1: currentUser._id,
                userId2,
            });
            if (!chatRooms.some((room) => room._id === res.data._id)) {
                setChatRooms((prev) => [res.data, ...prev]);
            }
            return res.data;
        } catch (err) {
            console.error("Failed to start chat", err);
        }
    };

    // Join a socket room
    const joinRoom = (chatRoomId) => {
        socket.emit("join_room", chatRoomId);
        setCurrentRoomId(chatRoomId);
    };

    // Send a message
    const sendMessage = async (chatRoomId, messageText, recieverId) => {
        try {
            await API.post("/chats/send", {
                chatRoomId,
                senderId: currentUser._id,
                message: messageText,
                recieverId,
            });

            socket.emit("send_message", {
                chatRoomId,
                message: messageText,
                senderId: currentUser._id,
            });

            // Update last message preview
            setChatRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room._id === chatRoomId
                        ? { ...room, lastMessage: messageText, lastUpdated: new Date() }
                        : room
                )
            );
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    // Listen for incoming socket messages
    useEffect(() => {
        const handleReceiveMessage = (data) => {
            const { chatRoomId, message, senderId, timestamp } = data;

            setMessages((prev) => ({
                ...prev,
                [chatRoomId]: [
                    ...(prev[chatRoomId] || []),
                    { senderId, message, timestamp: timestamp ? new Date(timestamp) : new Date() },
                ],
            }));

            setChatRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room._id === chatRoomId
                        ? { ...room, hasNewMessages: true }
                        : room
                )
            );
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, []);


    // Fetch chats when user logs in
    useEffect(() => {
        if (currentUser?._id) {
            fetchChats();
        }
    }, [currentUser]);

    return (
        <ChatContext.Provider
            value={{
                chatRooms,
                messages,
                fetchMessages,
                sendMessage,
                startChatWithUser,
                joinRoom,
                currentRoomId,
                loadingChats,
                loadingMessages,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
