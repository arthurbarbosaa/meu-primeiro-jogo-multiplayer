export default function renderScreen(
  screen,
  game,
  requestAnimationFrame,
  currentplayerId
) {
  const context = screen.getContext("2d");
  context.fillStyle = "white";
  context.clearRect(0, 0, 10, 10);

  for (const playerId in game.state.players) {
    const player = game.state.players[playerId];
    context.fillStyle = "black";
    context.fillRect(player.x, player.y, 1, 1);
  }

  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId];
    context.fillStyle = "green";
    context.fillRect(fruit.x, fruit.y, 1, 1);
  }

  const currentPlayer = game.state.players[currentplayerId];

  if (currentPlayer) {
    context.fillStyle = "#F0DB4F";
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
  }

  updateScoreboard(game, currentplayerId);

  function updateScoreboard(game, currentplayerId) {
    const scoreboardBody = document.getElementById("scoreboard-body");
    if (scoreboardBody) {
      const rows = [];
      for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        const playerScore = player.score || 0;
        const isCurrent = playerId === currentplayerId;
        rows.push({ playerId, playerScore, isCurrent });
      }

      rows.sort((a, b) => b.playerScore - a.playerScore);

      scoreboardBody.innerHTML = rows
        .map(
          (r) => `
            <tr ${r.isCurrent ? 'style="background:#F0DB4F"' : ""}>
              <td>${r.playerId}</td>
              <td>${r.playerScore}</td>
            </tr>
          `
        )
        .join("");
    }
  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame, currentplayerId);
  });
}
