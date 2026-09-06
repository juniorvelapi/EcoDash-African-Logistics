class Obstacle {
  constructor(obstacleConfig) {
    this.obstacleType = obstacleConfig.obstacleType;
    this.x = obstacleConfig.x;
    this.y = obstacleConfig.y;
    this.width = obstacleConfig.width;
    this.height = obstacleConfig.height;
    this.isSolid = obstacleConfig.isSolid ?? true;
    this.speed = obstacleConfig.speed || 0;
    this.direction = obstacleConfig.direction || 1;
    this.patrolMin = obstacleConfig.patrolMin;
    this.patrolMax = obstacleConfig.patrolMax;
    this.color = obstacleConfig.color || "#555";
    this.label = obstacleConfig.label || "";
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  update() {
    if (this.obstacleType === "traffic" && this.patrolMin !== undefined) {
      this.x += this.speed * this.direction;
      if (this.x <= this.patrolMin || this.x + this.width >= this.patrolMax) {
        this.direction *= -1;
      }
    }
  }

  draw(context) {
    context.save();

    if (this.obstacleType === "pothole") {
      context.fillStyle = "#3d2b1f";
      context.beginPath();
      context.ellipse(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        0,
        0,
        Math.PI * 2
      );
      context.fill();
    } else if (this.obstacleType === "river") {
      context.fillStyle = "rgba(42, 157, 143, 0.65)";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.strokeStyle = "#1d7590";
      context.strokeRect(this.x, this.y, this.width, this.height);
    } else if (this.obstacleType === "wildlife") {
      context.fillStyle = "#8b5e3c";
      context.beginPath();
      context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#fff";
      context.fillRect(this.x + 8, this.y + 10, 4, 4);
      context.fillRect(this.x + 18, this.y + 10, 4, 4);
    } else if (this.obstacleType === "fallenTree") {
      context.fillStyle = "#5c4033";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillStyle = "#2d5016";
      context.beginPath();
      context.arc(this.x + 10, this.y + this.height / 2, 10, 0, Math.PI * 2);
      context.arc(this.x + this.width - 10, this.y + this.height / 2, 10, 0, Math.PI * 2);
      context.fill();
    } else if (this.obstacleType === "construction") {
      context.fillStyle = "rgba(224, 122, 47, 0.35)";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.strokeStyle = "#e07a2f";
      context.setLineDash([6, 4]);
      context.strokeRect(this.x, this.y, this.width, this.height);
      context.setLineDash([]);
    } else if (this.obstacleType === "traffic") {
      context.fillStyle = "#c1121f";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillStyle = "#ffd166";
      context.fillRect(this.x + 8, this.y + 6, this.width - 16, 8);
    } else if (this.obstacleType === "loadShedding") {
      context.fillStyle = "rgba(0, 0, 0, 0.25)";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.strokeStyle = "#e63946";
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

    if (this.label) {
      context.fillStyle = "#f5f5f5";
      context.font = "11px Segoe UI, sans-serif";
      context.fillText(this.label, this.x + 4, this.y - 6);
    }

    context.restore();
  }
}

class DeliveryCheckpoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 22;
    this.isCollected = false;
  }

  checkCollection(playerVehicle) {
    if (this.isCollected) {
      return false;
    }

    const collected = Collision.circleOverlap(
      { x: this.x, y: this.y, radius: this.radius },
      { x: playerVehicle.x, y: playerVehicle.y, radius: 14 }
    );

    if (collected) {
      this.isCollected = true;
    }

    return collected;
  }

  draw(context) {
    if (this.isCollected) {
      return;
    }

    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(233, 196, 106, 0.35)";
    context.fill();
    context.strokeStyle = "#e9c46a";
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = "#e9c46a";
    context.font = "bold 12px Segoe UI, sans-serif";
    context.textAlign = "center";
    context.fillText("DELIVER", this.x, this.y + 4);
    context.restore();
  }
}
