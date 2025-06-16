import express from "express";
import http from "http";
import createGame from "./public/game.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static("public"));

const game = createGame();
console.log(game.state);

game.subscribe((command) => {
  console.log(`> Emitting ${command.type}`);
  sockets.emit(command.type, command);
});

sockets.on("connect", (socket) => {
  const playerId = socket.id;
  console.log(`> Player connected on Server: ${playerId}`);

  game.addPlayer({ playerId: playerId });
  game.start();

  socket.emit("setup", game.state);

  socket.on("disconnect", () => {
    game.removePlayer({ playerId: playerId });
    console.log(`> Player disconnected: ${playerId}`);
  });

  socket.on("move-player", (command) => {
    command.playerId = playerId;
    command.type = "move-player";

    game.movePlayer(command);
  });
});

server.listen(3000, () => {
  console.log("> Server listening on port: 3000 ");
});
