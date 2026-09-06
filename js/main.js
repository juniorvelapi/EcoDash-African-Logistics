window.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.getElementById("gameCanvas");
  const gameInstance = new Game(canvasElement);
  window.ecoDashGame = gameInstance;
});
