// import { Server } from "socket.io";
// import http from "http";

// const server = http.createServer();
// const io = new Server(server, {
// //   cors: { origin: "*", },
// });

import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static('dist'));

// Set up a route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

io.on("connection", socket => {
    console.log("Connected!");
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