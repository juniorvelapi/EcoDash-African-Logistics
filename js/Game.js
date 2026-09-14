class Game {
  constructor(canvasElement) {
    this.canvasElement = canvasElement;
    this.renderContext = canvasElement.getContext("2d");
    this.gameState = "START";
    this.audioManager = new AudioManager();
    this.gameUI = new GameUI(document.getElementById("ui-overlay"));

    this.missionScore = 0;
    this.collisionPenaltyCount = 0;
    this.lowBatteryWarningPlayed = false;
    this.rechargeSoundCooldown = 0;

    this.inputState = {
      accelerate: false,
      brake: false,
      rotateLeft: false,
      rotateRight: false
    };

    this.playerVehicle = new ElectricVehicle(480, 520);
    this.environment = new Environment();
    this.loadSheddingSchedule = new LoadSheddingSchedule([
      "Zone A - Soweto",
      "Zone B - Sandton",
      "Zone C - Midrand"
    ]);

    this.logicalWidth = 960;
    this.logicalHeight = 640;

    this.setupWorld();
    this.setupResponsiveCanvas();
    this.bindUIHandlers();
    this.bindInputHandlers();
    this.gameUI.showStart();
    this.renderFrame();
  }

  setupResponsiveCanvas() {
    const applyCanvasSize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      this.canvasElement.width = this.logicalWidth * pixelRatio;
      this.canvasElement.height = this.logicalHeight * pixelRatio;
      this.renderContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    applyCanvasSize();
    window.addEventListener("resize", applyCanvasSize);
  }

  setupWorld() {
    this.solarZones = [
      new SolarZone({ zoneName: "Grid Soweto", x: 180, y: 420, radius: 55, rechargeRate: 0.4 }),
      new SolarZone({ zoneName: "Grid Sandton", x: 760, y: 260, radius: 55, rechargeRate: 0.4 }),
      new SolarZone({ zoneName: "Grid Midrand", x: 480, y: 180, radius: 50, rechargeRate: 0.35 })
    ];

    this.obstacles = [
      new Obstacle({ obstacleType: "pothole", x: 300, y: 380, width: 46, height: 28, isSolid: false, label: "Pothole" }),
      new Obstacle({ obstacleType: "pothole", x: 620, y: 430, width: 40, height: 24, isSolid: false }),
      new Obstacle({ obstacleType: "river", x: 430, y: 500, width: 120, height: 36, isSolid: true, label: "Flooded Section" }),
      new Obstacle({ obstacleType: "wildlife", x: 720, y: 470, width: 28, height: 28, isSolid: true, label: "Wildlife" }),
      new Obstacle({ obstacleType: "fallenTree", x: 140, y: 250, width: 90, height: 24, isSolid: true, label: "Fallen Tree" }),
      new Obstacle({ obstacleType: "construction", x: 520, y: 320, width: 110, height: 70, isSolid: false, label: "Construction" }),
      new Obstacle({
        obstacleType: "traffic",
        x: 350,
        y: 280,
        width: 44,
        height: 24,
        speed: 1.4,
        patrolMin: 300,
        patrolMax: 650,
        isSolid: true,
        label: "Traffic"
      }),
      new Obstacle({
        obstacleType: "loadShedding",
        x: 650,
        y: 150,
        width: 180,
        height: 120,
        isSolid: false,
        label: "Load-Shed Zone"
      }),
      new Obstacle({
        obstacleType: "loadShedding",
        x: 120,
        y: 350,
        width: 160,
        height: 130,
        isSolid: false,
        label: "Load-Shed Zone"
      })
    ];

    this.deliveryCheckpoints = [
      new DeliveryCheckpoint(820, 420),
      new DeliveryCheckpoint(200, 220),
      new DeliveryCheckpoint(500, 360)
    ];

    this.environment.setLoadSheddingZones(
      this.obstacles
        .filter((obstacle) => obstacle.obstacleType === "loadShedding")
        .map((obstacle) => obstacle.getBounds())
    );
  }

  bindUIHandlers() {
    this.gameUI.setStartHandler(() => this.startGame());
    this.gameUI.setResumeHandler(() => this.resumeGame());
    this.gameUI.setRestartHandler(() => this.restartGame());
  }

  bindInputHandlers() {
    window.addEventListener("keydown", (event) => this.handleKeyDown(event));
    window.addEventListener("keyup", (event) => this.handleKeyUp(event));
  }

  handleKeyDown(event) {
    if (event.key === "p" || event.key === "P") {
      if (this.gameState === "PLAYING") {
        this.pauseGame();
      } else if (this.gameState === "PAUSED") {
        this.resumeGame();
      }
    }

    if (event.key === "m" || event.key === "M") {
      this.audioManager.toggleMute();
    }

    if (this.gameState !== "PLAYING") {
      return;
    }

    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      this.inputState.accelerate = true;
    }
    if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
      this.inputState.brake = true;
    }
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      this.inputState.rotateLeft = true;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      this.inputState.rotateRight = true;
    }
  }

  handleKeyUp(event) {
    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      this.inputState.accelerate = false;
    }
    if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
      this.inputState.brake = false;
    }
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      this.inputState.rotateLeft = false;
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      this.inputState.rotateRight = false;
    }
  }

  startGame() {
    this.gameState = "PLAYING";
    this.gameUI.startPanel.classList.add("hidden");
    this.gameLoop();
  }

  pauseGame() {
    this.gameState = "PAUSED";
    this.gameUI.showPause();
  }

  resumeGame() {
    this.gameState = "PLAYING";
    this.gameUI.hidePause();
    this.gameLoop();
  }

  restartGame() {
    this.missionScore = 0;
    this.collisionPenaltyCount = 0;
    this.lowBatteryWarningPlayed = false;
    this.playerVehicle.reset(480, 520);
    this.deliveryCheckpoints.forEach((checkpoint) => {
      checkpoint.isCollected = false;
    });
    this.gameUI.gameOverPanel.classList.add("hidden");
    this.gameState = "PLAYING";
    this.gameLoop();
  }

  gameLoop() {
    if (this.gameState !== "PLAYING") {
      return;
    }

    this.updateGame();
    this.renderFrame();
    requestAnimationFrame(() => this.gameLoop());
  }

  updateGame() {
    this.environment.update();
    this.loadSheddingSchedule.tick();
    this.syncLoadSheddingState();

    this.playerVehicle.resetTerrainDrag();
    this.playerVehicle.updateMovement(this.inputState, this.environment);
    Physics.clampToBounds(this.playerVehicle, this.logicalWidth, this.logicalHeight, 20);

    this.obstacles.forEach((obstacle) => obstacle.update());
    this.handleCollisions();
    this.handleSolarRecharge();
    this.handleDeliveries();
    this.checkGameOverConditions();
  }

  syncLoadSheddingState() {
    const blackoutActive = this.loadSheddingSchedule.isBlackoutActive;
    const activeZoneIndex = this.loadSheddingSchedule.currentZoneIndex;

    this.solarZones.forEach((solarZone, zoneIndex) => {
      const isAffectedZone = blackoutActive && zoneIndex === activeZoneIndex;
      solarZone.setActive(
        !isAffectedZone,
        this.loadSheddingSchedule.getCountdownSeconds()
      );
    });
  }

  handleCollisions() {
    const playerBounds = this.playerVehicle.getBounds();

    this.obstacles.forEach((obstacle) => {
      if (!Collision.aabb(playerBounds, obstacle.getBounds())) {
        return;
      }

      if (obstacle.obstacleType === "pothole") {
        this.playerVehicle.applyPotholeHit();
        this.missionScore = Math.max(0, this.missionScore - 5);
        this.collisionPenaltyCount += 1;
        this.audioManager.playCollisionSound();
      } else if (obstacle.obstacleType === "wildlife") {
        this.playerVehicle.speed *= -0.4;
        this.missionScore = Math.max(0, this.missionScore - 8);
        this.collisionPenaltyCount += 1;
        this.audioManager.playCollisionSound();
      } else if (obstacle.obstacleType === "river" || obstacle.obstacleType === "fallenTree" || obstacle.obstacleType === "traffic") {
        this.playerVehicle.x -= Math.cos(this.playerVehicle.angleRadians) * 8;
        this.playerVehicle.y -= Math.sin(this.playerVehicle.angleRadians) * 8;
        this.playerVehicle.speed *= 0.3;
        this.missionScore = Math.max(0, this.missionScore - 6);
        this.collisionPenaltyCount += 1;
        this.audioManager.playCollisionSound();
      } else if (obstacle.obstacleType === "construction") {
        this.playerVehicle.maxSpeed = 2.5;
        this.playerVehicle.terrainDrag = 0.12;
      }
    });

    if (!this.obstacles.some((obstacle) =>
      obstacle.obstacleType === "construction" && Collision.aabb(playerBounds, obstacle.getBounds())
    )) {
      this.playerVehicle.maxSpeed = 4.2;
    }
  }

  handleSolarRecharge() {
    if (this.rechargeSoundCooldown > 0) {
      this.rechargeSoundCooldown -= 1;
    }

    this.solarZones.forEach((solarZone) => {
      if (solarZone.isActive && solarZone.containsPlayer(this.playerVehicle)) {
        this.playerVehicle.rechargeBattery(solarZone.rechargeRate);
        if (this.rechargeSoundCooldown <= 0) {
          this.audioManager.playRechargeSound();
          this.rechargeSoundCooldown = 30;
        }
      }
    });
  }

  handleDeliveries() {
    this.deliveryCheckpoints.forEach((checkpoint) => {
      if (checkpoint.checkCollection(this.playerVehicle)) {
        this.missionScore += 10;
        this.audioManager.playDeliverySound();
      }
    });
  }

  checkGameOverConditions() {
    if (this.playerVehicle.batteryLevel <= 0) {
      this.endGame("Battery depleted. Recharge at solar microgrids before the next blackout.");
      return;
    }

    if (this.playerVehicle.batteryLevel < 20 && !this.lowBatteryWarningPlayed) {
      this.audioManager.playLowBatterySound();
      this.lowBatteryWarningPlayed = true;
    }

    const allDeliveriesComplete = this.deliveryCheckpoints.every((checkpoint) => checkpoint.isCollected);
    if (allDeliveriesComplete) {
      this.missionScore += 25;
      this.endGame("All deliveries complete! Excellent route planning through load-shedding zones.");
    }
  }

  calculateEnergyEfficiency() {
    if (this.playerVehicle.batteryUsed <= 0) {
      return 100;
    }
    return (this.playerVehicle.totalDistanceTravelled / this.playerVehicle.batteryUsed) * 2;
  }

  endGame(messageText) {
    this.gameState = "GAME_OVER";
    this.audioManager.playGameOverSound();

    const distanceKm = this.playerVehicle.totalDistanceTravelled / 100;
    const energyEfficiency = this.calculateEnergyEfficiency();

    const scoreEntry = {
      missionScore: this.missionScore,
      distanceKm,
      energyEfficiency,
      date: new Date().toLocaleDateString()
    };

    const highScores = Storage.saveScore(scoreEntry);
    const summaryText = `${messageText} Score: ${this.missionScore} | Distance: ${distanceKm.toFixed(2)} km | Efficiency: ${energyEfficiency.toFixed(1)}%`;
    this.gameUI.showGameOver(summaryText);
    this.lastHighScores = highScores;
    this.renderFrame();
  }

  renderFrame() {
    const canvasWidth = this.logicalWidth;
    const canvasHeight = this.logicalHeight;

    this.renderContext.save();
    this.renderContext.globalAlpha = this.environment.visibilityAlpha;
    this.environment.drawBackground(this.renderContext, canvasWidth, canvasHeight);

    this.solarZones.forEach((solarZone) => solarZone.draw(this.renderContext));
    this.obstacles.forEach((obstacle) => obstacle.draw(this.renderContext));
    this.deliveryCheckpoints.forEach((checkpoint) => checkpoint.draw(this.renderContext));
    this.playerVehicle.draw(this.renderContext);

    this.environment.drawWeatherOverlay(this.renderContext, canvasWidth, canvasHeight);
    this.renderContext.restore();

    const hudData = {
      missionScore: this.missionScore,
      distanceKm: this.playerVehicle.totalDistanceTravelled / 100,
      energyEfficiency: this.calculateEnergyEfficiency(),
      batteryLevel: this.playerVehicle.batteryLevel
    };

    this.gameUI.drawHud(this.renderContext, hudData);
    this.gameUI.drawMiniMap(this.renderContext, canvasWidth, this.playerVehicle, this.deliveryCheckpoints);
    this.loadSheddingSchedule.drawSchedulePanel(this.renderContext, canvasWidth - 240, 140);

    const highScores = this.lastHighScores || Storage.getHighScores();
    this.gameUI.drawHighScores(this.renderContext, canvasWidth, canvasHeight, highScores);
  }
}
