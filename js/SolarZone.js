class SolarZone {
  constructor(zoneConfig) {
    this.zoneName = zoneConfig.zoneName;
    this.x = zoneConfig.x;
    this.y = zoneConfig.y;
    this.radius = zoneConfig.radius;
    this.rechargeRate = zoneConfig.rechargeRate || 0.35;
    this.isActive = true;
  }

  setActive(activeState) {
    this.isActive = activeState;
  }

  containsPlayer(playerVehicle) {
    return Collision.circleOverlap(
      { x: this.x, y: this.y, radius: this.radius },
      { x: playerVehicle.x, y: playerVehicle.y, radius: 12 }
    );
  }

  draw(context) {
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    if (this.isActive) {
      context.fillStyle = "rgba(233, 196, 106, 0.18)";
      context.strokeStyle = "#e9c46a";
    } else {
      context.fillStyle = "rgba(230, 57, 70, 0.15)";
      context.strokeStyle = "#e63946";
    }

    context.fill();
    context.lineWidth = 2;
    context.setLineDash([8, 6]);
    context.stroke();
    context.setLineDash([]);

    context.fillStyle = this.isActive ? "#e9c46a" : "#e63946";
    context.font = "12px Segoe UI, sans-serif";
    context.textAlign = "center";
    context.fillText(this.zoneName, this.x, this.y - this.radius - 8);
    context.fillText(this.isActive ? "SOLAR GRID" : "OFFLINE", this.x, this.y + 4);

    context.restore();
  }
}
