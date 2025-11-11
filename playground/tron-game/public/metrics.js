import path from "path";
import fs from "fs";

export default function createMetrics() {
  const state = {
    totalMoves: 0,
    totalFruitsAdded: 0,
    totalFruitsCollected: 0,
    totalPlayers: 0,
  };

  function saveToFile() {
    const filePath = path.resolve("metrics.json");
    try {
      fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
      console.log("> Metrics saved to metrics.json");
    } catch (err) {
      console.error("Error saving metrics:", err);
    }
  }

  function handleGameNotification(command) {
    switch (command.type) {
      case "add-player":
        state.totalPlayers++;
        break;

      case "remove-player":
        state.totalPlayers = Math.max(0, state.totalPlayers - 1);
        break;

      case "add-fruit":
        state.totalFruitsAdded++;
        break;

      case "remove-fruit":
        state.totalFruitsCollected++;
        break;
    }

    saveToFile();
  }

  return {
    state,
    handleGameNotification,
  };
}
