const Physics = {
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },

  distance(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  },

  applyDrag(velocity, dragCoefficient) {
    return velocity * (1 - dragCoefficient);
  },

  moveByAngle(positionX, positionY, angleRadians, speed) {
    return {
      x: positionX + Math.cos(angleRadians) * speed,
      y: positionY + Math.sin(angleRadians) * speed
    };
  },

  applyWindForce(velocityX, velocityY, windAngle, windForce) {
    return {
      x: velocityX + Math.cos(windAngle) * windForce,
      y: velocityY + Math.sin(windAngle) * windForce
    };
  },

  clampToBounds(entity, worldWidth, worldHeight, padding) {
    entity.x = Physics.clamp(entity.x, padding, worldWidth - padding);
    entity.y = Physics.clamp(entity.y, padding, worldHeight - padding);
  }
};
