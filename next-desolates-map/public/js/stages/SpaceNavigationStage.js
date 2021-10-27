// TODO refactor: this should be a class extending a generic Stage class,
// With draw, mouseclicked, load and unload functions
function _drawSpaceNavigation() {
  cursor(CROSS);

  lights();
  ambientLight(64);

  // Sky box
  texture(skyboxImg);
  noStroke();
  sphere(SKYBOX_RADIUS, 24, 24);

  // Planets & sun
  // Must be sorted by distance for alpha to work
  celestialObjects.sort((p1, p2) => p2.getDistWithCam(cam) - p1.getDistWithCam(cam));
  celestialObjects.filter(o => o.isInCluster(Config.cluster)).forEach(o => o.draw(cam));

  // Move camera
  handleCameraMovement();
}

let oldCamPos = [0, 0, 0];
let ongoingCamMov;
function handleCameraMovement() {
  if (ongoingCamMov && !ongoingCamMov.isEnded()) {
    ongoingCamMov.tick();

    return;
  }

  orbitControl(1, 1, 0.05);
  perspective(PI / 3, width / height, 1, SKYBOX_RADIUS * 2);

  if (keyIsDown(LEFT_ARROW)) {
    x = (0.02) * 1.0;// this regulates the speed of the movement
  }

  else if (keyIsDown(RIGHT_ARROW)) {
    x = (0.02) * -1.0;
  } else {
    x = 0;
  }

  if (keyIsDown(UP_ARROW)) {
    zMove = -(5) * 1.0;
  }

  else if (keyIsDown(DOWN_ARROW)) {
    zMove = (5) * 1.0;
  } else {
    zMove = 0.0;
  }

  cam.pan(x);
  cam.move(0, 0, zMove);

  if (dist(cam.eyeX, cam.eyeY, cam.eyeZ, 0, 0, 0) > SKYBOX_RADIUS * 0.75) {
    cam.setPosition(oldCamPos[0], oldCamPos[1], oldCamPos[2]);
  } else {
    oldCamPos[0] = cam.eyeX;
    oldCamPos[1] = cam.eyeY;
    oldCamPos[2] = cam.eyeZ;
  }
}