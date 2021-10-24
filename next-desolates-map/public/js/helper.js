function drawCameraPos(cam, font) {
  const r = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  fill("white");

  textFont(font);
  textSize(24);
  textAlign(LEFT, CENTER);

  push();

  rotateY(atan(cam.eyeX / cam.eyeZ));
  rotateX(atan(-cam.eyeY / cam.eyeZ));
  translate(cam.centerX, cam.centerY, cam.centerZ + 10);
  text(`${r(cam.eyeX)} ${r(cam.eyeY)} ${r(cam.eyeZ)}`, 20, 20);
  text(`${r(cam.centerX)} ${r(cam.centerY)} ${r(cam.centerZ)}`, 20, 40);
  text(`${r(cam.upX)} ${r(cam.upY)} ${r(cam.upZ)}`, 20, 60);
  pop();
}

function getPrimaryColorFromPalette(palette) {
  let str = PALETTE_TO_COLOR_MAP[palette].primary;
  return parseInt(str.slice(1), 16);
}

// TODO move ot its own class
function setInfoPanelTo(planet, navFn) {
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

  let btnElem = document.getElementById('nav-btn');
  btnElem.addEventListener('click', navFn);
}

