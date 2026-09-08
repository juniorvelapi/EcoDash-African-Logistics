const Collision = {
  aabb(rectA, rectB) {
    return (
      rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y
    );
  },

  circleOverlap(circleA, circleB) {
    const distance = Physics.distance(circleA.x, circleA.y, circleB.x, circleB.y);
    return distance < circleA.radius + circleB.radius;
  },

  circleRectOverlap(circle, rect) {
    const closestX = Physics.clamp(circle.x, rect.x, rect.x + rect.width);
    const closestY = Physics.clamp(circle.y, rect.y, rect.y + rect.height);
    const distance = Physics.distance(circle.x, circle.y, closestX, closestY);
    return distance <= circle.radius;
  },

  pointInRect(pointX, pointY, rect) {
    return (
      pointX >= rect.x &&
      pointX <= rect.x + rect.width &&
      pointY >= rect.y &&
      pointY <= rect.y + rect.height
    );
  },

  resolveBounce(entity, normalX, normalY, bounceStrength) {
    const dotProduct = entity.velocityX * normalX + entity.velocityY * normalY;
    entity.velocityX -= 2 * dotProduct * normalX * bounceStrength;
    entity.velocityY -= 2 * dotProduct * normalY * bounceStrength;
    entity.speed *= 0.5;
  }
};
