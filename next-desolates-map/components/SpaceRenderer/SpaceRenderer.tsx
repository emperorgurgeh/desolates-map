// import Sketch from "react-p5";
import p5Types from "p5";
import dynamic from "next/dynamic";
import { PALETTE_TO_COLOR_MAP } from "../../utils/SpaceRenderer/consts";

import Sun from "../../js/Sun";
import Planet from "../../js/Planet";

import _drawSpaceNavigationStage from "../../js/stages/SpaceNavigationStage";
import { addScreenPositionFunction } from "../../js/lib/3dposition";
import CameraMovement from "../../js/CameraMovement";

const Sketch = dynamic(import("react-p5"), {
    ssr: false,
});

const SKYBOX_RADIUS = 5000;
const SUN_RADIUS = 150;
const PLANET_RADIUS = 10;
const LOW_RES = false;
const TEXTURE_SUFFIX = LOW_RES ? "_low_res" : "";

export let ongoingCamMov: any;

export default function SpaceRenderer() {
    let celestialObjects: Array<any> = [];
    let skyboxImg: any,
        sunImg: any,
        planetTextures: any,
        cam: any,
        planetSelectedTexture: any;

    let robotoRegFont: any, jetbrainsMonoFont: any;

    let framerates: Array<any> = [];
    let avgFrameRate = 60;

    function loadPlanets(sources: Array<string>) {
        let planets: Array<any> = [];
        _loadPlanetsRec(sources, 0, planets);
    }

    function _loadPlanetsRec(
        sources: Array<string>,
        idx: number,
        planetJson: any
    ) {
        if (idx >= sources.length) {
            _initAfterPlanetsLoad(planetJson);
        } else {
            fetch(sources[idx])
                .then((response) => response.json())
                .then((json) => {
                    planetJson = planetJson.concat(json);
                    _loadPlanetsRec(sources, idx + 1, planetJson);
                });
        }
    }

    function _initAfterPlanetsLoad(planetJson: any) {
        planetJson.forEach(function (p: any) {
            const textureImg = planetTextures[p.attributes.palette];
            const planet = new Planet(
                PLANET_RADIUS,
                textureImg,
                p.attributes.coords,
                p.name.split("DESOLATEs ")[1],
                p.image,
                p.link,
                jetbrainsMonoFont,
                planetSelectedTexture
            );
            celestialObjects.push(planet);
        });

        // parseURLParamsAndInit();
    }

    function preload(p5: p5Types) {
        skyboxImg = p5.loadImage(
            `assets/skybox/eso_milkyway${TEXTURE_SUFFIX}.jpg`
        );
        sunImg = p5.loadImage("assets/sprites/lensflare0.png");

        planetTextures = {};
        Object.keys(PALETTE_TO_COLOR_MAP).forEach((c) => {
            planetTextures[c] = p5.loadImage(
                `assets/planets/${c}${TEXTURE_SUFFIX}.png`
            );
        });

        planetSelectedTexture = p5.loadImage(`assets/sprites/ring.png`);

        robotoRegFont = p5.loadFont("assets/fonts/Roboto-Regular.ttf");
        jetbrainsMonoFont = p5.loadFont("assets/fonts/JetBrainsMono200.ttf");
    }

    function setup(p5: p5Types, canvasParentRef: Element) {
        p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL).parent(
            canvasParentRef
        );

        cam = p5.createCamera();
        cam.setPosition(0, 0, 2500);
        cam.lookAt(0, 0, 0);
        p5.setAttributes("antialias", true);
        addScreenPositionFunction(p5);

        const sun = new Sun(SUN_RADIUS, sunImg, [0, 0, 0]);
        celestialObjects.push(sun);

        loadPlanets([
            "data/first-mission.json",
            "data/second-mission.json",
            "data/second-mission-addendum.json",
            "data/second-mission-second-addendum.json",
            "data/third-mission.json",
        ]);
    }

    function draw(p5: p5Types) {
        _drawSpaceNavigationStage(p5, skyboxImg, celestialObjects, cam);

        framerates.push(p5.frameRate());
        if (framerates.length >= 200) {
            framerates.shift();
            avgFrameRate =
                framerates.reduce((a, b) => a + b) / framerates.length;
        }
    }

    function windowResized(p5: p5Types) {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    function mouseClicked(p5: p5Types) {
        let matches = celestialObjects.filter((o) =>
            o.isMouseOver(p5.mouseX, p5.mouseY, cam, p5)
        );

        if (matches.length > 0) {
            const o = matches.pop();
            console.log(`clicked on ${o.name}`);

            // loadPlanetInfoFor(o);

            for (let p of celestialObjects) {
                p.setSelected(false);
            }
            o.setSelected(true);
        }
    }

    function doubleClicked(p5: p5Types) {
        let matches = celestialObjects.filter((o) =>
            o.isMouseOver(p5.mouseX, p5.mouseY, cam, p5)
        );

        if (matches.length > 0) {
            const o = matches.pop();
            console.log(`double clicked on ${o.name} at ${o.getPosVector(p5)}`);

            // loadPlanetInfoFor(o);

            for (let p of celestialObjects) {
                p.setSelected(false);
            }
            o.setSelected(true);

            ongoingCamMov = new CameraMovement(
                cam,
                o.getPosVector(p5),
                1500,
                undefined,
                p5
            );
            ongoingCamMov.start(p5);
        }
    }

    return (
        <Sketch
            setup={setup}
            draw={draw}
            preload={preload}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            windowResized={windowResized}
            mouseClicked={mouseClicked}
            doubleClicked={doubleClicked}
        />
    );
}
