class SolarZone {
  constructor(zoneConfig) {
    this.zoneName = zoneConfig.zoneName;
    this.x = zoneConfig.x;
    this.y = zoneConfig.y;
    this.radius = zoneConfig.radius;
    this.rechargeRate = zoneConfig.rechargeRate || 0.35;
    this.isActive = true;
    this.secondsUntilRestore = 0;
    this.offlinePulseFrame = 0;
  }

  setActive(activeState, secondsUntilRestore = 0) {
    this.isActive = activeState;
    this.secondsUntilRestore = activeState ? 0 : secondsUntilRestore;
    if (activeState) {
      this.offlinePulseFrame = 0;
    }
  }

  containsPlayer(playerVehicle) {
    const playerBounds = playerVehicle.getBounds();
    return Collision.circleRectOverlap(
      { x: this.x, y: this.y, radius: this.radius },
      playerBounds
    );
  }

  draw(context) {
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    if (this.isActive) {
      context.fillStyle = "rgba(233, 196, 106, 0.18)";
      context.strokeStyle = "#e9c46a";
      context.lineWidth = 2;
    } else {
      this.offlinePulseFrame += 1;
      const pulseAlpha = 0.22 + Math.abs(Math.sin(this.offlinePulseFrame * 0.08)) * 0.28;
      context.fillStyle = `rgba(20, 20, 20, ${pulseAlpha})`;
      context.strokeStyle = "#e63946";
      context.lineWidth = 3;
    }

    context.fill();
    context.setLineDash(this.isActive ? [8, 6] : [4, 4]);
    context.stroke();
    context.setLineDash([]);

    if (!this.isActive) {
      context.strokeStyle = "#e63946";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(this.x - 16, this.y - 16);
      context.lineTo(this.x + 16, this.y + 16);
      context.moveTo(this.x + 16, this.y - 16);
      context.lineTo(this.x - 16, this.y + 16);
      context.stroke();
    }

    context.fillStyle = this.isActive ? "#e9c46a" : "#e63946";
    context.font = "12px Segoe UI, sans-serif";
    context.textAlign = "center";
    context.fillText(this.zoneName, this.x, this.y - this.radius - 8);
    context.fillText(this.isActive ? "SOLAR GRID" : "OFFLINE", this.x, this.y + 4);

    if (!this.isActive && this.secondsUntilRestore > 0) {
      context.fillStyle = "#f5f5f5";
      context.font = "11px Segoe UI, sans-serif";
      context.fillText(`BACK IN ${this.secondsUntilRestore}s`, this.x, this.y + 18);
    }

    context.restore();
  }
}
