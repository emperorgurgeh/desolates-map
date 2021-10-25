class CameraMovement {
  constructor(cam, dest, durationMillis, stopBeforeDest = 100) {
    this.cam = cam;
    this.origin = createVector(cam.eyeX, cam.eyeY, cam.eyeZ);
    this.originLookAt = createVector(cam.centerX, cam.centerY, cam.centerZ);
    this.dest = dest;
    this.distance = max(this.origin.dist(this.dest) - stopBeforeDest, 0);
    this.durationMillis = durationMillis;
  }

  start() {
    this.startTime = millis();
    this.lastTickMillis = this.startTime;
  }

  isEnded() {
    return this.startTime && millis() > this.startTime + this.durationMillis;
  }

  tick() {
    const curTime = millis();
    const timeEllapsed = curTime - this.startTime;

    if (timeEllapsed > this.durationMillis) {
      console.warn("Called tick on a camera movement that had ended");
      return;
    }

    const curCamLookAt = p5.Vector.lerp(
      this.originLookAt,
      this.dest,
      timeEllapsed / this.durationMillis
    );
    this.cam.lookAt(curCamLookAt.x + 0, curCamLookAt.y + 0, curCamLookAt.z + 0);

    const movement =
      -1 *
      (curTime - this.lastTickMillis) *
      (this.distance / this.durationMillis);
    this.cam.move(0, 0, movement);

    this.lastTickMillis = curTime;
    return;
  }
}
