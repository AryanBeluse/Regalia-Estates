import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema(
    {
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        }],
        lastMessage: {
            type: String,
            default: '',
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema)

export default ChatRoom
