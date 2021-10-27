class Planet extends CelestialObject {
  constructor(radius, textureImg, pos, name, image, link) {
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
      z: pos[2]
    });
  }

  draw(cam) {
    const distWithCam =
      dist(cam.eyeX, cam.eyeY, cam.eyeZ, this.x, this.y, this.z);

    push();
    const detail = this._getLevelOfDetail(cam);
    translate(this.x, this.y, this.z);

    texture(this.textureImg);
    sphere(this.radius, detail, detail);

    // Draw labels
    this._drawLabel(distWithCam);

    if (this.selected) {
      this._drawSelectionRing(cam);
    }

    pop();
  }

  isInCluster(cluster) {
    return this.cluster === cluster;
  }

  _drawLabel(distWithCam) {

    push();
    let opacity;
    if (distWithCam > 300) {
      opacity = map(distWithCam, 1000, 1500, 255, 0);
    } else {
      opacity = map(distWithCam, 100, 50, 255, 0);
    }

    fill(255, opacity);

    textFont(jetbrainsMonoFont);
    textAlign(LEFT, CENTER);

    let deltaX = cam.eyeX - (this.x + 20);
    let deltaY = cam.eyeY - this.y;
    let deltaZ = cam.eyeZ - this.z;

    rotateY(atan2(deltaX, deltaZ));
    rotateX(atan(-deltaY / sqrt(pow(deltaX, 2) + pow(deltaZ, 2))));


    textSize(12);
    text(this.name, 15, -15);
    // textSize(10);
    // text(this.owner, 20, 0);
    pop();
  }

  _drawSelectionRing(cam) {
    push();
    let deltaX = cam.eyeX - this.x;
    let deltaY = cam.eyeY - this.y;
    let deltaZ = cam.eyeZ - this.z;

    rotateY(atan2(deltaX, deltaZ));
    rotateX(atan(-deltaY / sqrt(pow(deltaX, 2) + pow(deltaZ, 2))));

    texture(planetSelectedTexture);
    plane(this.radius * 4, this.radius * 4);
    pop();
  }

  setSelected(value) {
    this.selected = value;
  }

  isMouseOver(mouseX, mouseY, cam) {
    const CLICKABLE_THRESHOLD = 2000;

    if (Config.cluster != this.cluster) return false;

    const r = this.radius,
      x = this.x,
      y = this.y,
      z = this.z;

    const distWithCam = this.getDistWithCam(cam);

    if (distWithCam > CLICKABLE_THRESHOLD) return false;

    // Retrieve the left most and right-most 2d projection points
    // for a cube surrounding the sphere
    // TODO: this could be done more accurately and probably efficiently
    // if I just do math.. need to just find a point in the sphere surface
    let smallestX, biggestX, smallestY, biggestY;
    for (let px = x - r; px <= x + r; px += 2 * r) {
      for (let py = y - r; py <= y + r; py += 2 * r) {
        for (let pz = z - r; pz <= z + r; pz += 2 * r) {

          const screenPoint = screenPosition(px, py, pz);
          screenPoint.x += width / 2;
          screenPoint.y += height / 2;

          if (!smallestX) {
            smallestX = screenPoint.x;
          } else if (screenPoint.x < smallestX && screenPoint.x >= 0) {
            smallestX = screenPoint.x;
          }

          if (!biggestX) {
            biggestX = screenPoint.x;
          } else if (screenPoint.x > biggestX && screenPoint.x <= width) {
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
          } else if (screenPoint.y > biggestY && screenPoint.y <= height) {
            biggestY = screenPoint.y;
          }
        }
      }
    }

    if (mouseX >= smallestX &&
      mouseX <= biggestX &&
      mouseY >= smallestY &&
      mouseY <= biggestY) {
      return true;
    } else {
      return false;
    }
  }

  _getLevelOfDetail(cam) {
    const distWithCam = this.getDistWithCam(cam);

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