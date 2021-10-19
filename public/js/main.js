/**
 * TODO: handle mobile
 */


var skyboxImg, sunImg, planetTextures;
const SKYBOX_RADIUS = 5000;
let robotoRegFont, jetbrainsMonoFont;
const SUN_RADIUS = 150;
const PLANET_RADIUS = 10;
const LOW_RES = true;
const TEXTURE_SUFFIX = LOW_RES ? "_low_res" : "";
let cluster;
let canvas;



function loadPlanets(sources) {
  let planets = [];
  loadPlanetsRec(sources, 0, planets);
}

function loadPlanetsRec(sources, idx, planetJson) {
  if (idx >= sources.length) {
    initPlanets(planetJson);
  } else {
    fetch(sources[idx])
      .then(response => response.json())
      .then(json => {
        planetJson = planetJson.concat(json);
        loadPlanetsRec(sources, idx + 1, planetJson);
      });
  }
}

let celestialObjects = [];
let myPlanets = [];
function initPlanets(planetJson) {
  planetJson.forEach(function (p) {

    const textureImg = planetTextures[p.attributes.palette];
    const planet = new Planet(
      PLANET_RADIUS,
      textureImg,
      p.attributes.coords,
      p.name.split("DESOLATEs ")[1],
      p.image,
      p.link
    );
    celestialObjects.push(planet);
  });
  planetsDidLoad = true;
}

let planetsDidLoad = false;
function preload() {
  skyboxImg = loadImage(`assets/skybox/eso_milkyway${TEXTURE_SUFFIX}.png`);
  sunImg = loadImage('assets/sprites/lensflare0.png');
  planetTextures = {};
  Object.keys(PALETTE_TO_COLOR_MAP).forEach( c => {
    planetTextures[c] = loadImage(`assets/planets/${c}${TEXTURE_SUFFIX}.png`);
  });
  planetSelectedTexture = loadImage(`assets/sprites/ring.png`);

  robotoRegFont = loadFont("assets/fonts/Roboto-Regular.ttf");
  jetbrainsMonoFont = loadFont("assets/fonts/JetBrainsMono200.ttf");
  loadPlanets([
    'data/first-mission.json',
    'data/second-mission.json',
    'data/second-mission-addendum.json',
    'data/second-mission-second-addendum.json',
    'data/third-mission.json'
  ]);
}

function setup() {
  parseURLParams();

  canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  cam = createCamera();
  cam.setPosition(0, 0, 2500);
  cam.lookAt(0, 0, 0);
  setAttributes('antialias', true);
  addScreenPositionFunction();

  const sun = new Sun(SUN_RADIUS, sunImg, [0,0,0]);
  celestialObjects.push(sun);

  // TODO: move to when planets loaded, disable input
  select("#search-btn").mouseClicked(function() {
    const query = select("#search-input").value();
    planetSearch(query, function(p) {
      print(`Found ${p.name}`);
      setInfoPanelTo(p, function() {
        ongoingCamMov = new CameraMovement(cam, p.getPosVector(), 1500);
        ongoingCamMov.start();
      });

      for (let po of celestialObjects) {
        po.setSelected(false);
      }
      p.setSelected(true);

      ongoingCamMov = new CameraMovement(cam, p.getPosVector(), 1500);
      ongoingCamMov.start();

      return false;
    });
  });

  select("#search-input").elt.onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.code || e.key;
    if (keyCode == 'Enter'){

      const query = select("#search-input").value();
      planetSearch(query, function(p) {
        print(`Found ${p.name}`);
        setInfoPanelTo(p, function() {
          ongoingCamMov = new CameraMovement(cam, p.getPosVector(), 1500);
          ongoingCamMov.start();
        });

        for (let po of celestialObjects) {
          po.setSelected(false);
        }
        p.setSelected(true);

        ongoingCamMov = new CameraMovement(cam, p.getPosVector(), 1500);
        ongoingCamMov.start();

        return false;
      });

      return false;
    }
  }

  canvas.parent('#main-container');
}


let framerates = [];
let avgFrameRate = 60;
function draw() {
  background(0, 0, 0);

  if (!planetsDidLoad) return;

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
  celestialObjects.forEach(o => o.draw(cam));

  // Move camera
  handleCameraMovement();

  framerates.push(frameRate());
  if (framerates.length >= 200) {
    framerates.shift();
    avgFrameRate = framerates.reduce((a, b) => a + b) / framerates.length;
  }
}

function drawSun() {
  push();
  rotateY(atan2(cam.eyeX, cam.eyeZ));
  rotateX(atan(-cam.eyeY / sqrt(pow(cam.eyeX,2) + pow(cam.eyeZ, 2))));
  texture(sunImg);
  plane(SUN_RADIUS, SUN_RADIUS);
  pop();
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
    // y = (0.01) * 1.0;
    zMove = -(5) * 1.0;
  }

  else if (keyIsDown(DOWN_ARROW)) {
    // y = (0.01) * -1.0;
    zMove = (5) * 1.0;
  } else {
    y = 0.0;
    zMove = 0.0;
  }

  cam.pan(x);
  cam.tilt(y);
  cam.move(0, 0, zMove);

  if (dist(cam.eyeX, cam.eyeY, cam.eyeZ, 0, 0, 0) > SKYBOX_RADIUS) {
    cam.setPosition(oldCamPos[0], oldCamPos[1], oldCamPos[2]);
  } else {
    oldCamPos[0] = cam.eyeX;
    oldCamPos[1] = cam.eyeY;
    oldCamPos[2] = cam.eyeZ;
  }
}

// Select planet
function mouseClicked() {
  let matches =
    celestialObjects.filter(o => o.isMouseOver(mouseX, mouseY, cam));

  if (matches.length > 0) {
    const o = matches.pop();
    print(`clicked on ${o.name}`);

    setInfoPanelTo(o, function() {
      ongoingCamMov = new CameraMovement(cam, o.getPosVector(), 1500);
      ongoingCamMov.start();
    });

    for (let p of celestialObjects) {
      p.setSelected(false);
    }
    o.setSelected(true);
  }
}

// Select and move to planet
function doubleClicked() {
  let matches =
    celestialObjects.filter(o => o.isMouseOver(mouseX, mouseY, cam));

  if (matches.length > 0) {
    const o = matches.pop();
    print(`double clicked on ${o.name} at ${o.getPosVector()}`);

    setInfoPanelTo(o, function() {
      ongoingCamMov = new CameraMovement(cam, o.getPosVector(), 1500);
      ongoingCamMov.start();
    });

    for (let p of celestialObjects) {
      p.setSelected(false);
    }
    o.setSelected(true);

    ongoingCamMov = new CameraMovement(cam, o.getPosVector(), 1500);
    ongoingCamMov.start();
  }
}

function planetSearch(query, callbackFound) {
  query = query.trim();

  for (let o of celestialObjects) {

    let isMatch = false;
    if (!o.name) continue;

    const oNumber = o.name.split("#")[1].trim();

    for (let i = query.length; i <= oNumber.length; i++) {
      let paddedQuery = query.padStart(i, '0');
      if (paddedQuery === oNumber) {
        isMatch = true;
        break;
      }
    }

    if (isMatch) {
      let cont = callbackFound(o);
      if (!cont) break;
    }

  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function parseURLParams() {

  const urlParams = getURLParams();

  if (urlParams.mypl) {
    // TODO clean this ugly mess
    if (!planetsDidLoad) {
      setTimeout(function() {
        myPlanets = urlParams.mypl.split(',');
        myPlanets.forEach(p => {
          planetSearch(p, (found) => found.setSelected(true));
        });
      }, 500)

      return;
    }
    myPlanets = urlParams.mypl.split(',');
    print(myPlanets);
    myPlanets.forEach(p => {
      planetSearch(p, (found) => found.setSelected(true));
    });
  }

  // TODO: uncomment and continue
  // const clusterRegex = /^([A-H])([0-8])+/i;
  // if (urlParams.cluster && clusterRegex.test(urlParams.cluster)) {
  //   cluster = new Cluster(...urlParams.cluster.match(clusterRegex).slice(1));
  //   console.info(`cluster selected: ${cluster}`);
  //   const CLUSTER_TITLE_ID = "#cluster-name";
  //   select(CLUSTER_TITLE_ID).html(`${cluster.toString()} cluster`);
  // } else {
  //   console.info(`No cluster selected`);
  //   const CLUSTER_TITLE_ID = "#cluster-name";
  //   select(CLUSTER_TITLE_ID).html(`No cluster selected`);
  // }
}