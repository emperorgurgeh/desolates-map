const INITIAL_WARP_SPEED = 2;
const WARP_SPEED_INC_PER_FRAME = 0.3;

let warpspeed;
let frozenCamCenter;
let fromCluster;
let lastDist;

function _drawClusterTransitionStage() {
  blendMode(LIGHTEST);

  lights();
  ambientLight(64);

  push();
  fill("white");
  translate(frozenCamCenter.x, frozenCamCenter.y, frozenCamCenter.z);
  sphere(20);
  pop();

  // Planets & sun
  // Must be sorted by distance for alpha to work
  celestialObjects.sort(
    (p1, p2) => p2.getDistWithCam(cam) - p1.getDistWithCam(cam)
  );

  celestialObjects
    .filter((o) => o.isInCluster(fromCluster))
    .forEach((o) => o.draw(cam));

  // Move camera
  warpspeed += WARP_SPEED_INC_PER_FRAME; // TODO should be time delta based
  // warpspeed = min(warpspeed, 10.0); // There seems to be a bug where if speed goes beyond 10, alpha channels breaks
  cam.move(0, 0, -1 * warpspeed);

  const oldLastDist = lastDist;
  lastDist = dist(
    frozenCamCenter.x,
    frozenCamCenter.y,
    frozenCamCenter.z,
    cam.eyeX,
    cam.eyeY,
    cam.eyeZ
  );

  if (lastDist - oldLastDist > 0) {
    changeStage(Stage.SPACE_NAVIGATION);
    cam.setPosition(0, 0, -1250);
    cam.lookAt(0, 0, 0);
  }
}

function _loadClusterTransitionStage() {
  frozenCamCenter = {
    x: cam.centerX,
    y: cam.centerY,
    z: cam.centerZ,
  };

  warpspeed = INITIAL_WARP_SPEED;
  fromCluster = Config.cluster;

  lastDist = dist(
    frozenCamCenter.x,
    frozenCamCenter.y,
    frozenCamCenter.z,
    cam.eyeX,
    cam.eyeY,
    cam.eyeZ
  );
}

function _unloadClusterTransitionStage() {
  frozenCamCenter = null;
  fromCluster = null;
  lastDist = null;
}
