/**
 * TODO: handle mobile
 */


var skyboxImg, sunImg, planetTextures;
const SKYBOX_RADIUS = 5000;
let robotoRegFont, jetbrainsMonoFont;
const SUN_RADIUS = 150;
const PLANET_RADIUS = 10;
const LOW_RES = false;
const TEXTURE_SUFFIX = LOW_RES ? "_low_res" : "";

let canvas;

const Config = {};

function loadPlanets(sources) {
  let planets = [];
  _loadPlanetsRec(sources, 0, planets);
}

function _loadPlanetsRec(sources, idx, planetJson) {
  if (idx >= sources.length) {
    _initAfterPlanetsLoad(planetJson);
  } else {
    fetch(sources[idx])
      .then(response => response.json())
      .then(json => {
        planetJson = planetJson.concat(json);
        _loadPlanetsRec(sources, idx + 1, planetJson);
      });
  }
}

let celestialObjects = [];
let myPlanets = [];
function _initAfterPlanetsLoad(planetJson) {
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

  parseURLParamsAndInit();
}

function preload() {
  skyboxImg = loadImage(`assets/skybox/eso_milkyway${TEXTURE_SUFFIX}.jpg`);
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
  Config.cluster = "";
  Config.stage = Stage.LOADING;

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

  switch (Config.stage) {
    case Stage.LOADING:
      // TODO implement loading screen
      // drawLoadingScreen();
      break;
    case Stage.CLUSTER_SELECTION:
      _drawClusterSelection();
      break;
    case Stage.CLUSTER_TRANSITION:
      // _drawClusterTransition();
      break;
    case Stage.SPACE_NAVIGATION:
      _drawSpaceNavigation();
      break;
  }

  framerates.push(frameRate());
  if (framerates.length >= 200) {
    framerates.shift();
    avgFrameRate = framerates.reduce((a, b) => a + b) / framerates.length;
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

function parseURLParamsAndInit() {

  const urlParams = getURLParams();

  if (urlParams.mypl) {
    myPlanets = urlParams.mypl.split(',');
    print(myPlanets);
    // TODO replace for something more useful, or remove altogether
    myPlanets.forEach(p => {
      planetSearch(p, (found) => found.setSelected(true));
    });
  }

  const clusterParam = urlParams.cluster ? urlParams.cluster.toLowerCase() : undefined;
  if (clusterParam && Cluster.NAMES.includes(clusterParam)) {
    Config.cluster = clusterParam;
    console.info(`cluster selected: ${clusterParam}`);
    changeStage(Stage.SPACE_NAVIGATION);
  } else {
    console.info(`No cluster selected`);
    changeStage(Stage.CLUSTER_SELECTION);
  }
}

const Stage = Object.freeze({
  LOADING: 0,
  CLUSTER_SELECTION: 1,
  CLUSTER_TRANSITION: 2,
  SPACE_NAVIGATION: 3,
  toString: (idx) => Object.keys(Stage).filter(k => Stage[k] == idx)[0]
});

function changeStage(newStage) {
  console.info(`Transitioning stages from: ${Stage.toString(Config.stage)} to ${Stage.toString(newStage)}`);
  _cleanupStage(Config.stage);
  _loadupStage(newStage);
  Config.stage = newStage;
}

function _loadupStage(stage) {
  switch (stage) {
    case Stage.LOADING:
      break;
    case Stage.CLUSTER_SELECTION:
      select("#nav-container").removeClass("hidden");
      selectAll(".btn-cluster").forEach(b => b.mouseClicked(function(e) {
        Config.cluster = e.target.getAttribute("data-cluster");
        console.info(`cluster selected: ${Config.cluster}`);
        changeStage(Stage.SPACE_NAVIGATION);
      }));
      break;
    case Stage.CLUSTER_TRANSITION:
      break;
    case Stage.SPACE_NAVIGATION:
      // TODO implement loading up sidebar
      // const CLUSTER_TITLE_ID = "#cluster-name";
      // select(CLUSTER_TITLE_ID).html(`${Cluster.getGreekLetterFromName(clusterParam)} cluster`);
      break;
  }
}

function _cleanupStage(stage) {
  switch (stage) {
    case Stage.LOADING:
      break;
    case Stage.CLUSTER_SELECTION:
      // TODO remove cluster selection panel
      select("#nav-container").addClass("hidden");
      break;
    case Stage.CLUSTER_TRANSITION:
      break;
    case Stage.SPACE_NAVIGATION:
      break;
  }
}