import ChatRoom from "../models/chatRoom.model.js";
import Message from "../models/message.model.js";

const startChat = async (req, res) => {
    try {
        const { userId1, userId2 } = req.body;

        let chatRoom = await ChatRoom.findOne({
            participants: { $all: [userId1, userId2] },
        });

        if (!chatRoom) {
            chatRoom = await ChatRoom.create({
                participants: [userId1, userId2],
            });
        }
        res.status(200).json(chatRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong starting chat' });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { chatRoomId, senderId, message } = req.body;

        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) return res.status(404).json({ message: 'Chatroom not found' });

        const receiverId = chatRoom.participants.find(id => id !== senderId);

        const newMessage = await Message.create({
            chatRoomId,
            senderId,
            receiverId,
            message,
            timestamp: new Date(),
        });

        chatRoom.lastMessage = message;
        chatRoom.lastUpdated = new Date();
        await chatRoom.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong sending message' });
    }
};

const getMessages = async (req, res) => {
    try {
        const { chatRoomId } = req.params;

        const messages = await Message.find({ chatRoomId }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

const getMyChats = async (req, res) => {
    try {
        const { userId } = req.params;

        const chatRooms = await ChatRoom.find({ participants: userId })
            .populate('participants', 'username avatar')
            .sort({ lastUpdated: -1 });

        res.status(200).json(chatRooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch chats' });
    }
};



export {
    startChat,
    sendMessage,
    getMessages,
    getMyChats
}