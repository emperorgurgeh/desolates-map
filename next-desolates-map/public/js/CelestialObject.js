class CelestialObject {
  constructor(pos) {
    this.x = pos[0];
    this.y = pos[1];
    this.z = pos[2];
  }

  getDistWithCam(cam) {
    return dist(cam.eyeX, cam.eyeY, cam.eyeZ, this.x, this.y, this.z);
  }

  draw(cam) {
    throw Error("draw() must be implemented");
  }

  isMouseOver(mouseX, mouseY, cam) {
    return false;
  }

  setSelected() {}

  isSelected() {
    return false;
  }

  getPosVector() {
    return createVector(this.x, this.y, this.z);
  }

  isInCluster(cluster) {
    throw Error("isInCluster() must be implemented");
  }
}
