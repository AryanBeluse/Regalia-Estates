import { io } from "socket.io-client";

const socket = io("https://regalia-estates.onrender.com", {
    withCredentials: true,
});

export default socket;
