class AudioManager {
  constructor() {
    this.audioContext = null;
    this.isMuted = false;
  }

  ensureContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  playTone(frequency, durationSeconds, volumeLevel) {
    if (this.isMuted) {
      return;
    }

    this.ensureContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volumeLevel;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + durationSeconds);
  }

  playCollisionSound() {
    this.playTone(180, 0.12, 0.08);
  }

  playRechargeSound() {
    this.playTone(520, 0.08, 0.05);
  }

  playDeliverySound() {
    this.playTone(660, 0.1, 0.06);
    setTimeout(() => this.playTone(880, 0.12, 0.05), 90);
  }

  playLowBatterySound() {
    this.playTone(120, 0.2, 0.07);
  }

  playGameOverSound() {
    this.playTone(300, 0.15, 0.06);
    setTimeout(() => this.playTone(200, 0.2, 0.05), 120);
  }
}
