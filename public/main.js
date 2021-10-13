SCALE_FACTOR = 5;

function init(planets) {
  // Create the visualization and put it in our div.
  const viz = new Spacekit.Simulation(document.getElementById('main-container'), {
    basePath: '.',
    startDate: Date.now(),
    startPaused: true,
    camera: {
      enableDrift: true,
    },
  });

  // Create a skybox
  viz.createSkybox(Spacekit.SkyboxPresets.ESO_GIGAGALAXY);
  viz.createStars({minSize: 1});

  // And then there was light
  const sunPositions = [[5, 3, -3]/*, [-2, -2, 2], [3, 1, 4]*/];
  let suns = [];
  sunPositions.forEach((sun, i) => {
    sunObj = viz.createObject(
      'sun'+i,
      Object.assign(Spacekit.SpaceObjectPresets.SUN, {
        position: sun,
        scale: [(i+3)*SCALE_FACTOR,
          (i+3)*SCALE_FACTOR,
          (i+3)*SCALE_FACTOR
        ]
      }),
    );
    suns.push(sunObj);
  });

  function setInfoPanelTo(planet) {
    let panelElem = document.getElementById('info-panel');
    if (!panelElem.classList.contains('scale-in-hor-left')) {
      panelElem.classList.add('scale-in-hor-left');
      panelElem.classList.remove('hidden');
    }

    let titleElem = document.getElementById('planet-name');
    titleElem.innerHTML = planet.name;

    let linkElem = document.getElementById('planet-link');
    linkElem.href = planet.link;

    let imgElem = document.getElementById('planet-image');
    imgElem.src = planet.image;
  }

  function getPrimaryColorFromPalette(palette) {
    let str = PALETTE_TO_COLOR_MAP[palette].primary;
    return parseInt(str.slice(1), 16);
  }

  planets.forEach(function(planet) {
    let sphere = viz.createSphere(planet.name, {
      position: planet.attributes.coords.map((c) => c/15),
      radius: 0.5 * SCALE_FACTOR,
      labelText: planet.name.split("DESOLATEs")[1],
      color: getPrimaryColorFromPalette(planet.attributes.palette),
      textureUrl: 'assets/planets/Icy.png',
    });
    planet.sphere = sphere;
    let label = sphere.getLabel();
    label.addEventListener("mouseover", function(){
      setInfoPanelTo(planet);
    });

    // label.addEventListener("click", function(){
    //   viz.zoomToFit(sphere, 2);
    // });
  });


  // Set up viewport
  viz.zoomToFit(suns[0], 25/SCALE_FACTOR);
}

function loadPlanets(src) {
  fetch(src)
    .then(response => response.json())
    .then(json => init(json));
}

loadPlanets('data/first-mission.json');

