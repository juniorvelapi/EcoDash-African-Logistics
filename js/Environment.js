class Environment {
  constructor() {
    this.rainIntensity = 0;
    this.windAngleRadians = 0;
    this.windForce = 0;
    this.terrainDragBonus = 0;
    this.visibilityAlpha = 1;
    this.rainTimer = 0;
    this.windTimer = 0;
    this.loadSheddingZones = [];
  }

  setLoadSheddingZones(zoneRects) {
    this.loadSheddingZones = zoneRects;
  }

  update() {
    this.rainTimer += 1;
    this.windTimer += 1;

    if (this.rainTimer > 600) {
      this.rainTimer = 0;
      this.rainIntensity = this.rainIntensity > 0 ? 0 : 0.55;
      this.visibilityAlpha = this.rainIntensity > 0 ? 0.72 : 1;
      this.terrainDragBonus = this.rainIntensity > 0 ? 0.06 : 0;
    }

    if (this.windTimer > 240) {
      this.windTimer = 0;
      this.windAngleRadians = Math.random() * Math.PI * 2;
      this.windForce = Math.random() * 0.08;
    }
  }

  isPointInLoadSheddingZone(pointX, pointY) {
    return this.loadSheddingZones.some((zoneRect) =>
      Collision.pointInRect(pointX, pointY, zoneRect)
    );
  }

  drawBackground(context, canvasWidth, canvasHeight) {
    const skyGradient = context.createLinearGradient(0, 0, 0, canvasHeight);
    skyGradient.addColorStop(0, "#f4a261");
    skyGradient.addColorStop(1, "#2a9d8f");
    context.fillStyle = skyGradient;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    context.fillStyle = "#2d5016";
    context.fillRect(0, canvasHeight * 0.35, canvasWidth, canvasHeight * 0.65);

    context.fillStyle = "#c4a35a";
    context.fillRect(60, 120, canvasWidth - 120, canvasHeight - 200);

    context.strokeStyle = "#a48440";
    context.lineWidth = 3;
    context.setLineDash([18, 16]);
    context.beginPath();
    context.moveTo(canvasWidth / 2, 130);
    context.lineTo(canvasWidth / 2, canvasHeight - 70);
    context.stroke();
    context.setLineDash([]);

    this.drawNdebeleBorder(context, canvasWidth, canvasHeight);
  }

  drawNdebeleBorder(context, canvasWidth, canvasHeight) {
    const patternColors = ["#e63946", "#e9c46a", "#2a9d8f", "#264653"];
    const blockSize = 16;

    for (let blockIndex = 0; blockIndex < canvasWidth / blockSize; blockIndex += 1) {
      context.fillStyle = patternColors[blockIndex % patternColors.length];
      context.fillRect(blockIndex * blockSize, 0, blockSize, 8);
      context.fillRect(blockIndex * blockSize, canvasHeight - 8, blockSize, 8);
    }
  }

  drawWeatherOverlay(context, canvasWidth, canvasHeight) {
    if (this.rainIntensity <= 0) {
      return;
    }

    context.save();
    context.globalAlpha = this.rainIntensity * 0.35;
    context.fillStyle = "#264653";
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    context.strokeStyle = "rgba(255, 255, 255, 0.35)";
    context.lineWidth = 1;
    for (let rainDropIndex = 0; rainDropIndex < 80; rainDropIndex += 1) {
      const rainX = (rainDropIndex * 53 + this.rainTimer * 3) % canvasWidth;
      const rainY = (rainDropIndex * 29 + this.rainTimer * 7) % canvasHeight;
      context.beginPath();
      context.moveTo(rainX, rainY);
      context.lineTo(rainX - 4, rainY + 10);
      context.stroke();
    }

    context.restore();
  }
}
