import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    // cors: { origin: "*" }
});

app.use(express.static('public'));

// Set up a route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on("connection", socket => {
    socket.on("move", ({ name, trail }) => {
        socket.broadcast.emit("trail", { name: socket.id, trail });
    });
    // socket.emit("message", { msg: "hello!" });

    socket.on('disconnect', () => {
        socket.broadcast.emit("leave", { name: socket.id });
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const port = process.env.PORT ?? 8080
server.listen(port, ()=>{
    console.log("Listening at http://localhost:" + port);
});