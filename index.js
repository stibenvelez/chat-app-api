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
    const id = socket.id;
    let name = socket.on("conected", (data) => {
        name = data;
        socket.broadcast.emit("messages", {
            id,
            name,
            message: `${name} se ha unido al chat`,
            type: "notification"
        });
    });

    socket.on("disconnect", () => {
        io.emit("messages", {
            id,
            server: "Server",
            message: `${name} ha dejado el chat`,
            type: "notification"
        });
    });

    socket.on("message", (name, message) => {
        io.emit("messages", { id, name, message, type: "message" });
    });
    socket.on("writing", (name) => {
        socket.broadcast.emit("writing", { id, name, message: `${name} esta escribiendo`, type: "writing" });
    });
});


server.listen(PORT);
