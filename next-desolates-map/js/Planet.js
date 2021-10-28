import CelestialObject from "./CelestialObject"
import { Cluster } from "./Cluster"

const LOW_RES = false;
export default class Planet extends CelestialObject {

  constructor(radius, textureImg, pos, name, image, link, jetbrainsMonoFont, planetSelectedTexture) {
    super(Cluster.getTransformedPos(pos));
    this.origCoords = pos;
    this.radius = radius;
    this.textureImg = textureImg;
    this.name = name;
    this.image = image;
    this.link = link;
    this.selected = false;
    this.cluster = Cluster.getForPlanet({
      x: pos[0],
      y: pos[1],
      z: pos[2],
    });
    this.jetbrainsMonoFont = jetbrainsMonoFont;
    this.planetSelectedTexture = planetSelectedTexture;
  }

  draw(cam, p5) {
    const distWithCam = p5.dist(
      cam.eyeX,
      cam.eyeY,
      cam.eyeZ,
      this.x,
      this.y,
      this.z
    );

    p5.push();
    const detail = this._getLevelOfDetail(cam, p5);
    p5.translate(this.x, this.y, this.z);

    // ADD CONFIG
    // if (Config.stage == Stage.CLUSTER_TRANSITION) {
    //   // tint(random([0, 255]), random([0, 255]), random([0, 255]));
    // }
    p5.texture(this.textureImg);
    p5.sphere(this.radius, detail, detail);

    // Draw labels
    this._drawLabel(distWithCam, p5, cam);

    if (this.selected) {
      this._drawSelectionRing(cam, p5);
    }

    p5.pop();
  }

  isInCluster(cluster) {
    return this.cluster === cluster;
  }

  _drawLabel(distWithCam, p5, cam) {
    // ADD CONFIG
    // if (Config.stage != Stage.SPACE_NAVIGATION) return;

    if (distWithCam > 1500 || distWithCam < 50) {
      return;
    }

    let opacity;
    if (distWithCam > 300) {
      opacity = p5.map(distWithCam, 1000, 1500, 255, 0);
    } else {
      opacity = p5.map(distWithCam, 100, 50, 255, 0);
    }

    p5.fill(255, opacity);

    p5.textFont(this.jetbrainsMonoFont);
    p5.textAlign(p5.p5LEFT, p5.CENTER);

    let deltaX = cam.eyeX - (this.x + 20);
    let deltaY = cam.eyeY - this.y;
    let deltaZ = cam.eyeZ - this.z;

    p5.push();
    p5.rotateY(Math.atan2(deltaX, deltaZ));
    p5.rotateX(Math.atan(-deltaY / Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2))));

    p5.textSize(12);
    p5.text(this.name, 15, -15);
    // textSize(10);
    // text(this.owner, 20, 0);
    p5.pop();
  }

  _drawSelectionRing(cam, p5) {
    p5.push();
    let deltaX = cam.eyeX - this.x;
    let deltaY = cam.eyeY - this.y;
    let deltaZ = cam.eyeZ - this.z;

    p5.rotateY(Math.atan2(deltaX, deltaZ));
    p5.rotateX(Math.atan(-deltaY / Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2))));

    p5.texture(this.planetSelectedTexture);
    p5.plane(this.radius * 4, this.radius * 4);
    p5.pop();
  }

  setSelected(value) {
    this.selected = value;
  }

  isSelected = () => this.selected;

  isMouseOver(mouseX, mouseY, cam, p5) {
    const CLICKABLE_THRESHOLD = 2000;

    // ADD CONFIG
    // if (Config.cluster != this.cluster) return false;

    const r = this.radius,
      x = this.x,
      y = this.y,
      z = this.z;

    const distWithCam = this.getDistWithCam(cam, p5);

    if (distWithCam > CLICKABLE_THRESHOLD) return false;

    // Retrieve the left most and right-most 2d projection points
    // for a cube surrounding the sphere
    // TODO: this could be done more accurately and probably efficiently
    // if I just do math.. need to just find a point in the sphere surface
    let smallestX, biggestX, smallestY, biggestY;
    for (let px = x - r; px <= x + r; px += 2 * r) {
      for (let py = y - r; py <= y + r; py += 2 * r) {
        for (let pz = z - r; pz <= z + r; pz += 2 * r) {
          const screenPoint = p5.screenPosition(px, py, pz);
          screenPoint.x += p5.width / 2;
          screenPoint.y += p5.height / 2;

          if (!smallestX) {
            smallestX = screenPoint.x;
          } else if (screenPoint.x < smallestX && screenPoint.x >= 0) {
            smallestX = screenPoint.x;
          }

          if (!biggestX) {
            biggestX = screenPoint.x;
          } else if (screenPoint.x > biggestX && screenPoint.x <= p5.width) {
            biggestX = screenPoint.x;
          }

          // Bottom defined as Y is lowest
          if (!smallestY) {
            smallestY = screenPoint.y;
          } else if (screenPoint.y < smallestY && screenPoint.y >= 0) {
            smallestY = screenPoint.y;
          }

          if (!biggestY) {
            biggestY = screenPoint.y;
          } else if (screenPoint.y > biggestY && screenPoint.y <= p5.height) {
            biggestY = screenPoint.y;
          }
        }
      }
    }

    if (
      p5.mouseX >= smallestX &&
      p5.mouseX <= biggestX &&
      p5.mouseY >= smallestY &&
      p5.mouseY <= biggestY
    ) {
      return true;
    } else {
      return false;
    }
  }

  _getLevelOfDetail(cam, p5) {
    const distWithCam = this.getDistWithCam(cam, p5);

    if (LOW_RES) {
      if (distWithCam < 100) {
        return 12;
      } else if (distWithCam < 500) {
        return 8;
      } else if (distWithCam < 1000) {
        return 6;
      } else {
        return 4;
      }
    } else {
      if (distWithCam < 100) {
        return 24;
      } else if (distWithCam < 500) {
        return 12;
      } else if (distWithCam < 1000) {
        return 8;
      } else {
        return 4;
      }
    }
  }
}
