function _drawClusterSelection() {
  lights();
  ambientLight(64);

  // Sky box
  texture(skyboxImg);
  noStroke();
  sphere(SKYBOX_RADIUS, 24, 24);
}