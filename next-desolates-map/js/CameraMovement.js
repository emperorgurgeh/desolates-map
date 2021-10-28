export default class CameraMovement {
  constructor(cam, dest, durationMillis, stopBeforeDest = 100, p5) {
    this.cam = cam;
    this.origin = p5.createVector(cam.eyeX, cam.eyeY, cam.eyeZ);
    this.originLookAt = p5.createVector(cam.centerX, cam.centerY, cam.centerZ);
    this.dest = dest;
    this.distance = Math.max(this.origin.dist(this.dest) - stopBeforeDest, 0);
    this.durationMillis = durationMillis;
  }

  start(p5) {
    this.startTime = p5.millis();
    this.lastTickMillis = this.startTime;
  }

  isEnded(p5) {
    return this.startTime && p5.millis() > this.startTime + this.durationMillis;
  }

  tick(p5) {
    const curTime = p5.millis();
    const timeEllapsed = curTime - this.startTime;

    if (timeEllapsed > this.durationMillis) {
      console.warn("Called tick on a camera movement that had ended");
      return;
    }

    const curCamLookAt = window.p5.Vector.lerp(
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
