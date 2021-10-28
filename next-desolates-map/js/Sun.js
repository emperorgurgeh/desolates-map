import CelestialObject from "./CelestialObject"

// TODO support suns outside of (0,0,0)
// TODO support suns outside of (0,0,0)
export default class Sun extends CelestialObject {
  constructor(radius, textureImg, pos) {
    super(pos);
    this.radius = radius;
    this.textureImg = textureImg;
  }

  draw(cam, p5) {
    p5.push();
    p5.rotateY(Math.atan2(cam.eyeX, cam.eyeZ));
    p5.rotateX(Math.atan(-cam.eyeY / Math.sqrt(Math.pow(cam.eyeX, 2) + Math.pow(cam.eyeZ, 2))));
    p5.texture(this.textureImg);
    p5.plane(this.radius, this.radius);
    p5.pop();

  }

  isInCluster = () => true;
}


