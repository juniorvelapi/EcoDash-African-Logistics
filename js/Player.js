class ElectricVehicle {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.angleRadians = -Math.PI / 2;
    this.speed = 0;
    this.maxSpeed = 4.2;
    this.accelerationRate = 0.14;
    this.frictionCoefficient = 0.92;
    this.vehicleWidth = 34;
    this.vehicleHeight = 20;
    this.batteryLevel = 100;
    this.baseBatteryDrain = 0.015;
    this.speedDrainFactor = 0.004;
    this.terrainDrag = 0;
    this.speedPenaltyTimer = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.totalDistanceTravelled = 0;
    this.batteryUsed = 0;
  }

  getBounds() {
    return {
      x: this.x - this.vehicleWidth / 2,
      y: this.y - this.vehicleHeight / 2,
      width: this.vehicleWidth,
      height: this.vehicleHeight
    };
  }

  updateMovement(inputState, environment) {
    if (this.speedPenaltyTimer > 0) {
      this.speedPenaltyTimer -= 1;
    }

    if (inputState.rotateLeft) {
      this.angleRadians -= 0.055;
    }
    if (inputState.rotateRight) {
      this.angleRadians += 0.055;
    }

    const effectiveMaxSpeed = this.speedPenaltyTimer > 0
      ? this.maxSpeed * 0.55
      : this.maxSpeed;

    if (inputState.accelerate) {
      this.speed = Math.min(this.speed + this.accelerationRate, effectiveMaxSpeed);
    }
    if (inputState.brake) {
      this.speed = Math.max(this.speed - this.accelerationRate, 0);
    }

    const dragFromTerrain = this.terrainDrag + environment.terrainDragBonus;
    this.speed *= this.frictionCoefficient * (1 - dragFromTerrain);

    this.velocityX = Math.cos(this.angleRadians) * this.speed;
    this.velocityY = Math.sin(this.angleRadians) * this.speed;

    const windAdjusted = Physics.applyWindForce(
      this.velocityX,
      this.velocityY,
      environment.windAngleRadians,
      environment.windForce
    );

    const previousX = this.x;
    const previousY = this.y;

    this.x += windAdjusted.x;
    this.y += windAdjusted.y;

    const frameDistance = Physics.distance(previousX, previousY, this.x, this.y);
    this.totalDistanceTravelled += frameDistance;

    if (this.speed > 0.05) {
      const drainAmount = this.baseBatteryDrain + (this.speed * this.speed) * this.speedDrainFactor;
      this.batteryLevel -= drainAmount;
      this.batteryUsed += drainAmount;
    }

    this.batteryLevel = Physics.clamp(this.batteryLevel, 0, 100);
  }

  applyPotholeHit() {
    this.speed *= 0.45;
    this.speedPenaltyTimer = 45;
    this.terrainDrag = 0.18;
  }

  resetTerrainDrag() {
    this.terrainDrag = 0;
  }

  rechargeBattery(rechargeRate) {
    this.batteryLevel = Math.min(100, this.batteryLevel + rechargeRate);
  }

  reset(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.angleRadians = -Math.PI / 2;
    this.speed = 0;
    this.batteryLevel = 100;
    this.terrainDrag = 0;
    this.speedPenaltyTimer = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.totalDistanceTravelled = 0;
    this.batteryUsed = 0;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angleRadians);

    context.fillStyle = "#2a9d8f";
    context.fillRect(-this.vehicleWidth / 2, -this.vehicleHeight / 2, this.vehicleWidth, this.vehicleHeight);

    context.fillStyle = "#e9c46a";
    context.fillRect(this.vehicleWidth / 2 - 6, -4, 8, 8);

    context.fillStyle = "#264653";
    context.fillRect(-8, -this.vehicleHeight / 2 - 2, 16, 6);

    context.restore();
  }
}
