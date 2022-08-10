import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});

io.on("connection", (socket) => {
    let name = socket.on("conected", (data) => {
        name = data;
        socket.broadcast.emit("messages", {
            name,
            message: `${name} has joined the chat`,
        });
    });

    socket.on("disconnect", () => {
        io.emit("messages", {
            server: "Server",
            message: `${name}has left the chat`,
        });
    });

    socket.on("message", (name, message) => {
        io.emit("messages", { name, message });
    });
});


server.listen(PORT);
