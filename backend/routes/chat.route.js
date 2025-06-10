import express from 'express';
import {
    startChat,
    sendMessage,
    getMessages,
    getMyChats
} from '../controllers/chat.controller.js'


const chatRouter = express.Router();

chatRouter.post('/start', startChat);
chatRouter.post('/send', sendMessage);
chatRouter.get('/:chatRoomId/messages', getMessages);
chatRouter.get('/my/:userId', getMyChats);

export default chatRouter