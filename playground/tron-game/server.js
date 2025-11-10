import express from "express";
import http from "http";
import createGame from "./public/game.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static("public"));

const game = createGame();
let adminId = null;
let fruitInterval = null;
const FRUIT_FREQUENCY = 2000;

console.log(game.state);

game.subscribe((command) => {
  console.log(`> Emitting ${command.type}`);
  sockets.emit(command.type, command);
});

// Admin & fruit spawn control functions
function startFruitSpawn() {
  if (!fruitInterval) {
    fruitInterval = setInterval(() => game.addFruit(), FRUIT_FREQUENCY);
    console.log("> Fruit spawn started");
  }
}

function stopFruitSpawn() {
  if (fruitInterval) {
    clearInterval(fruitInterval);
    fruitInterval = null;
    console.log("> Fruit spawn stopped");
  }
}

function assignAdminIfNeeded() {
  if (!adminId) {
    const ids = Object.keys(game.state.players);
    if (ids.length > 0) {
      adminId = ids[0];
      if (game.state.players[adminId]) {
        game.state.players[adminId].isAdmin = true;
      }
      sockets.to(adminId).emit("admin-assigned");
      sockets.emit("admin-update", { adminId });
      console.log(`> Admin assigned: ${adminId}`);
    }
  }
}

sockets.on("connect", (socket) => {
  const playerId = socket.id;
  console.log(`> Player connected on Server: ${playerId}`);

  game.addPlayer({ playerId: playerId });

  socket.emit("setup", game.state);

  // assign admin if needed
  assignAdminIfNeeded();

  socket.on("disconnect", () => {
    game.removePlayer({ playerId: playerId });
    console.log(`> Player disconnected: ${playerId}`);

    // if admin disconnected, reassign
    if (playerId === adminId) {
      adminId = null;
      // clear old admin flag
      Object.values(game.state.players).forEach((p) => (p.isAdmin = false));
      assignAdminIfNeeded();
    }
  });

  socket.on("move-player", (command) => {
    command.playerId = playerId;
    command.type = "move-player";

    game.movePlayer(command);
  });

  // handle admin commands
  socket.on("admin-command", (cmd) => {
    if (socket.id !== adminId) {
      socket.emit("admin-error", { message: "Not admin" });
      console.log(`> Rejected admin command from non-admin: ${socket.id}`);
      return;
    }

    console.log(`> Admin command: ${cmd.action}`);

    switch (cmd.action) {
      case "start-fruits":
        startFruitSpawn();
        sockets.emit("fruits-started");
        break;
      case "stop-fruits":
        stopFruitSpawn();
        sockets.emit("fruits-stopped");
        break;
      case "reset-game":
        stopFruitSpawn();
        game.setState({ players: {}, fruits: {} });
        adminId = null;
        sockets.emit("game-reset", game.state);
        break;
      case "clear-scores":
        for (const id in game.state.players) {
          if (game.state.players[id]) {
            game.state.players[id].score = 0;
          }
        }
        sockets.emit("scores-cleared", game.state);
        break;
      default:
        socket.emit("admin-error", { message: "Unknown admin action" });
    }
  });
});

server.listen(3000, () => {
  console.log("> Server listening on port: 3000 ");
});
