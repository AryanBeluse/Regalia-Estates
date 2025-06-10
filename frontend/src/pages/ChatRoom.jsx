import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const ChatRoom = ({ receiverUser, chatRoomId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const { chatRooms, fetchMessages, sendMessage, messages, joinRoom } = useChat();
    const navigate = useNavigate();
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!chatRoomId) return;

        joinRoom(chatRoomId);

        if (!messages[chatRoomId]) {
            fetchMessages(chatRoomId);
        }
    }, [chatRoomId]);

    const handleSend = async () => {
        if (!inputMessage.trim()) return;
        await sendMessage(chatRoomId, inputMessage);
        setInputMessage('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages[chatRoomId]]);




    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 shadow-md bg-white">
                {receiverUser && (
                    <div className="flex items-center gap-3">
                        <img
                            src={receiverUser.avatar || '/default-avatar.png'}
                            alt="Receiver"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">{receiverUser.username}</span>
                            <span className="text-xs text-gray-400">{receiverUser.email}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages[chatRoomId]?.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`flex flex-col ${msg.senderId === currentUser._id ? 'items-end' : 'items-start'}`}
                    >
                        <div className={`p-2 px-4 rounded-3xl shadow ${msg.senderId === currentUser._id ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                            {msg.message}
                        </div>

                        <div className="text-xs text-gray-400 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Input Box */}
            <div className="p-4 border-t flex items-center gap-2 bg-white">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-full p-2 px-4 outline-none hover:bg-gray-50 transition-all"
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
