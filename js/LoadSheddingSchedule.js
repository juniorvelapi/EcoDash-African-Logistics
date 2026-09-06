class LoadSheddingSchedule {
  constructor(zoneNames) {
    this.zoneQueue = zoneNames;
    this.currentZoneIndex = 0;
    this.countdownSeconds = 20;
    this.elapsedFrames = 0;
    this.framesPerSecond = 60;
    this.isBlackoutActive = false;
  }

  tick() {
    this.elapsedFrames += 1;

    if (this.elapsedFrames >= this.framesPerSecond) {
      this.elapsedFrames = 0;
      this.countdownSeconds -= 1;

      if (this.countdownSeconds <= 0) {
        this.advanceSchedule();
      }
    }
  }

  advanceSchedule() {
    this.currentZoneIndex = (this.currentZoneIndex + 1) % this.zoneQueue.length;
    this.countdownSeconds = 20;
    this.isBlackoutActive = !this.isBlackoutActive;
  }

  getCurrentZoneName() {
    return this.zoneQueue[this.currentZoneIndex];
  }

  getNextZoneName() {
    const nextIndex = (this.currentZoneIndex + 1) % this.zoneQueue.length;
    return this.zoneQueue[nextIndex];
  }

  getCountdownSeconds() {
    return this.countdownSeconds;
  }

  drawSchedulePanel(context, panelX, panelY) {
    context.save();
    context.fillStyle = "rgba(20, 20, 20, 0.88)";
    context.strokeStyle = "#e9c46a";
    context.lineWidth = 2;
    context.fillRect(panelX, panelY, 220, 92);
    context.strokeRect(panelX, panelY, 220, 92);

    context.fillStyle = "#e9c46a";
    context.font = "bold 13px Segoe UI, sans-serif";
    context.fillText("LOAD-SHEDDING SCHEDULE", panelX + 10, panelY + 20);

    context.fillStyle = this.isBlackoutActive ? "#e63946" : "#2a9d8f";
    context.font = "12px Segoe UI, sans-serif";
    context.fillText(
      `Active: ${this.getCurrentZoneName()} (${this.isBlackoutActive ? "BLACKOUT" : "STANDBY"})`,
      panelX + 10,
      panelY + 42
    );

    context.fillStyle = "#f5f5f5";
    context.fillText(`Next: ${this.getNextZoneName()}`, panelX + 10, panelY + 60);

    const progressRatio = this.countdownSeconds / 20;
    context.fillStyle = "#444";
    context.fillRect(panelX + 10, panelY + 72, 200, 10);
    context.fillStyle = "#e07a2f";
    context.fillRect(panelX + 10, panelY + 72, 200 * progressRatio, 10);

    context.fillStyle = "#ddd";
    context.font = "11px Segoe UI, sans-serif";
    context.fillText(`${this.countdownSeconds}s until switch`, panelX + 10, panelY + 88);

    context.restore();
  }
}
