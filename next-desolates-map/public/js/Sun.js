// TODO support suns outside of (0,0,0)
class Sun extends CelestialObject {
  constructor(radius, textureImg, pos) {
    super(pos);
    this.radius = radius;
    this.textureImg = textureImg;
  }

  draw(cam) {
    push();
    rotateY(atan2(cam.eyeX, cam.eyeZ));
    rotateX(atan(-cam.eyeY / sqrt(pow(cam.eyeX, 2) + pow(cam.eyeZ, 2))));
    texture(this.textureImg);
    plane(this.radius, this.radius);
    pop();
  }

  isInCluster = () => true;
}
