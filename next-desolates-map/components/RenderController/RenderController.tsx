// import Sketch from "react-p5";
import p5Types from "p5";
import dynamic from "next/dynamic";
import { PALETTE_TO_COLOR_MAP } from "../../utils/SpaceRenderer/consts";

import { addScreenPositionFunction } from "../../js/lib/3dposition";

import SpaceRenderer from "../../core/SpaceRenderer";
import Sun from "../../core/modules/Sun";
import _drawSpaceNavigationStage from "../../core/stages/SpaceNavigationStage";
import CameraMovement from "../../core/modules/CameraMovement";

const Sketch = dynamic(import("react-p5"), {
    ssr: false,
});

export default function RenderController() {
    function preload(p5: p5Types) {
        const spaceRenderer = SpaceRenderer.getInstance();

        spaceRenderer.p5 = p5;

        spaceRenderer.skyboxImg = p5.loadImage(
            `assets/skybox/eso_milkyway${spaceRenderer.TEXTURE_SUFFIX}.jpg`
        );
        spaceRenderer.sunImg = p5.loadImage("assets/sprites/lensflare0.png");

        Object.keys(PALETTE_TO_COLOR_MAP).forEach((c) => {
            spaceRenderer.planetTextures[c] = p5.loadImage(
                `assets/planets/${c}${spaceRenderer.TEXTURE_SUFFIX}.png`
            );
        });

        spaceRenderer.planetSelectedTexture = p5.loadImage(
            `assets/sprites/ring.png`
        );

        spaceRenderer.robotoRegFont = p5.loadFont(
            "assets/fonts/Roboto-Regular.ttf"
        );
        spaceRenderer.jetbrainsMonoFont = p5.loadFont(
            "assets/fonts/JetBrainsMono200.ttf"
        );
    }

    function setup(p5: p5Types, canvasParentRef: Element) {
        const spaceRenderer = SpaceRenderer.getInstance();
        const { config, stage } = SpaceRenderer.getInstance();

        config.changeStage(stage.LOADING);

        p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL).parent(
            canvasParentRef
        );

        spaceRenderer.cam = p5.createCamera();
        spaceRenderer.cam.setPosition(0, 0, 2500);
        spaceRenderer.cam.lookAt(0, 0, 0);
        p5.setAttributes("antialias", true);
        addScreenPositionFunction(p5);

        const sun = new Sun(
            spaceRenderer.SUN_RADIUS,
            spaceRenderer.sunImg!,
            [0, 0, 0]
        );
        spaceRenderer.celestialObjects.push(sun);

        spaceRenderer.loadPlanets([
            "data/first-mission.json",
            "data/second-mission.json",
            "data/second-mission-addendum.json",
            "data/second-mission-second-addendum.json",
            "data/third-mission.json",
        ]);
    }

    function draw(p5: p5Types) {
        const spaceRenderer = SpaceRenderer.getInstance();
        const { framerates, config, stage } = SpaceRenderer.getInstance();

        switch (config.getStage()) {
            case stage.LOADING:
                // TODO implement loading screen
                // drawLoadingScreen();
                break;
            case stage.CLUSTER_SELECTION:
                // _drawClusterSelectionStage();
                break;
            case stage.CLUSTER_TRANSITION:
                // _drawClusterTransitionStage();
                break;
            case stage.SPACE_NAVIGATION:
                _drawSpaceNavigationStage();
                break;
        }

        _drawSpaceNavigationStage();

        framerates.push(p5.frameRate());
        if (framerates.length >= 200) {
            framerates.shift();
            spaceRenderer.avgFrameRate =
                framerates.reduce((a, b) => a + b) / framerates.length;
        }
    }

    function windowResized(p5: p5Types) {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    function mouseClicked(p5: p5Types) {
        const { celestialObjects } = SpaceRenderer.getInstance();

        let matches = celestialObjects.filter((o) =>
            o.isMouseOver(p5.mouseX, p5.mouseY)
        );

        if (matches.length > 0) {
            const o = matches.pop()!;
            console.log(`clicked on ${(o as any).name}`);

            // loadPlanetInfoFor(o);

            for (let p of celestialObjects) {
                p.setSelected(false);
            }
            o.setSelected(true);
        }
    }

    function doubleClicked(p5: p5Types) {
        const spaceRenderer = SpaceRenderer.getInstance();

        let matches = spaceRenderer.celestialObjects.filter((o) =>
            o.isMouseOver(p5.mouseX, p5.mouseY)
        );

        if (matches.length > 0) {
            const o = matches.pop()!;
            console.log(
                `double clicked on ${(o as any).name} at ${o.getPosVector()}`
            );

            // loadPlanetInfoFor(o);

            for (let p of spaceRenderer.celestialObjects) {
                p.setSelected(false);
            }
            o.setSelected(true);

            spaceRenderer.ongoingCamMov = new CameraMovement(
                o.getPosVector(),
                1500
            );
            spaceRenderer.ongoingCamMov.start(p5);
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
