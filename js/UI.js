class GameUI {
  constructor(overlayElement) {
    this.overlayElement = overlayElement;
    this.startPanel = null;
    this.pausePanel = null;
    this.gameOverPanel = null;
    this.createScreens();
  }

  createScreens() {
    this.startPanel = this.buildPanel(
      "start-panel",
      "EcoDash",
      "Deliver packages across Johannesburg in your electric van. Manage battery power, avoid infrastructure hazards, and recharge at solar microgrids — unless load-shedding shuts them down.",
      "Start Delivery",
      () => {}
    );

    this.pausePanel = this.buildPanel(
      "pause-panel",
      "Paused",
      "Press P or click Resume to continue your route.",
      "Resume",
      () => {}
    );
    this.pausePanel.classList.add("hidden");

    this.gameOverPanel = this.buildPanel(
      "gameover-panel",
      "Delivery Failed",
      "Your route has ended.",
      "Restart Route",
      () => {}
    );
    this.gameOverPanel.classList.add("hidden");

    this.overlayElement.appendChild(this.startPanel);
    this.overlayElement.appendChild(this.pausePanel);
    this.overlayElement.appendChild(this.gameOverPanel);
  }

  buildPanel(panelId, titleText, bodyText, buttonText, onClickHandler) {
    const panel = document.createElement("div");
    panel.id = panelId;
    panel.className = "screen-panel";

    const title = document.createElement("h1");
    title.textContent = titleText;

    const body = document.createElement("p");
    body.textContent = bodyText;

    const button = document.createElement("button");
    button.textContent = buttonText;
    button.addEventListener("click", onClickHandler);

    panel.appendChild(title);
    panel.appendChild(body);
    panel.appendChild(button);

    return panel;
  }

  setStartHandler(handler) {
    this.startPanel.querySelector("button").onclick = handler;
  }

  setResumeHandler(handler) {
    this.pausePanel.querySelector("button").onclick = handler;
  }

  setRestartHandler(handler) {
    this.gameOverPanel.querySelector("button").onclick = handler;
  }

  showStart() {
    this.startPanel.classList.remove("hidden");
    this.pausePanel.classList.add("hidden");
    this.gameOverPanel.classList.add("hidden");
  }

  showPause() {
    this.pausePanel.classList.remove("hidden");
  }

  hidePause() {
    this.pausePanel.classList.add("hidden");
  }

  showGameOver(summaryText) {
    this.gameOverPanel.querySelector("p").textContent = summaryText;
    this.gameOverPanel.classList.remove("hidden");
  }

  drawHud(context, hudData) {
    const hudPadding = 12;
    const hudWidth = 280;
    const hudHeight = 118;

    context.save();
    context.fillStyle = "rgba(20, 20, 20, 0.85)";
    context.fillRect(hudPadding, hudPadding, hudWidth, hudHeight);
    context.strokeStyle = "#e9c46a";
    context.strokeRect(hudPadding, hudPadding, hudWidth, hudHeight);

    context.fillStyle = "#e9c46a";
    context.font = "bold 14px Segoe UI, sans-serif";
    context.fillText("MISSION HUD", hudPadding + 10, hudPadding + 22);

    context.fillStyle = "#f5f5f5";
    context.font = "13px Segoe UI, sans-serif";
    context.fillText(`Score: ${hudData.missionScore}`, hudPadding + 10, hudPadding + 44);
    context.fillText(`Distance: ${hudData.distanceKm.toFixed(2)} km`, hudPadding + 10, hudPadding + 64);
    context.fillText(`Efficiency: ${hudData.energyEfficiency.toFixed(1)}%`, hudPadding + 10, hudPadding + 84);

    const batteryBarX = hudPadding + 10;
    const batteryBarY = hudPadding + 94;
    const batteryBarWidth = hudWidth - 20;
    const batteryBarHeight = 14;

    context.fillStyle = "#444";
    context.fillRect(batteryBarX, batteryBarY, batteryBarWidth, batteryBarHeight);

    const batteryRatio = hudData.batteryLevel / 100;
    let batteryColor = "#2a9d8f";
    if (batteryRatio < 0.5) {
      batteryColor = "#e9c46a";
    }
    if (batteryRatio < 0.25) {
      batteryColor = "#e63946";
    }

    context.fillStyle = batteryColor;
    context.fillRect(batteryBarX, batteryBarY, batteryBarWidth * batteryRatio, batteryBarHeight);
    context.strokeStyle = "#f5f5f5";
    context.strokeRect(batteryBarX, batteryBarY, batteryBarWidth, batteryBarHeight);

    context.fillStyle = "#ddd";
    context.font = "11px Segoe UI, sans-serif";
    context.fillText(`Battery: ${hudData.batteryLevel.toFixed(1)}%`, batteryBarX, batteryBarY - 4);

    context.fillStyle = "#aaa";
    context.font = "11px Segoe UI, sans-serif";
    context.fillText("P = Pause | M = Mute", hudPadding + 10, hudPadding + hudHeight - 6);

    context.restore();
  }

  drawMiniMap(context, canvasWidth, playerVehicle, checkpoints) {
    const mapSize = 110;
    const mapX = canvasWidth - mapSize - 12;
    const mapY = 12;

    context.save();
    context.fillStyle = "rgba(20, 20, 20, 0.85)";
    context.fillRect(mapX, mapY, mapSize, mapSize);
    context.strokeStyle = "#e9c46a";
    context.strokeRect(mapX, mapY, mapSize, mapSize);

    context.fillStyle = "#2a9d8f";
    context.fillRect(
      mapX + (playerVehicle.x / 960) * mapSize - 3,
      mapY + (playerVehicle.y / 640) * mapSize - 3,
      6,
      6
    );

    checkpoints.forEach((checkpoint) => {
      if (checkpoint.isCollected) {
        return;
      }
      context.fillStyle = "#e9c46a";
      context.beginPath();
      context.arc(
        mapX + (checkpoint.x / 960) * mapSize,
        mapY + (checkpoint.y / 640) * mapSize,
        4,
        0,
        Math.PI * 2
      );
      context.fill();
    });

    context.fillStyle = "#e9c46a";
    context.font = "10px Segoe UI, sans-serif";
    context.fillText("MAP", mapX + 8, mapY + 14);

    context.restore();
  }

  drawHighScores(context, canvasWidth, canvasHeight, highScores) {
    if (highScores.length === 0) {
      return;
    }

    context.save();
    context.fillStyle = "rgba(20, 20, 20, 0.85)";
    context.fillRect(canvasWidth - 230, canvasHeight - 130, 218, 118);
    context.strokeStyle = "#e9c46a";
    context.strokeRect(canvasWidth - 230, canvasHeight - 130, 218, 118);

    context.fillStyle = "#e9c46a";
    context.font = "bold 12px Segoe UI, sans-serif";
    context.fillText("HIGH SCORES", canvasWidth - 218, canvasHeight - 112);

    context.fillStyle = "#ddd";
    context.font = "11px Segoe UI, sans-serif";
    highScores.slice(0, 5).forEach((scoreEntry, index) => {
      context.fillText(
        `${index + 1}. ${scoreEntry.missionScore} pts | ${scoreEntry.distanceKm.toFixed(1)} km`,
        canvasWidth - 218,
        canvasHeight - 94 + index * 18
      );
    });

    context.restore();
  }
}
