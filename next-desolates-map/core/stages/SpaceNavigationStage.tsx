// const SKYBOX_RADIUS = 5000;

import p5Types, { Camera, Font, Image } from "p5";
import { useContext } from "react";
import { Clusters, SpaceRendererContext, Stages } from "../../pages/_app";
import CameraMovement from "../modules/CameraMovement";

// TODO refactor: this should be a class extending a generic Stage class,
// With draw, mouseclicked, load and unload functions
export default function SpaceNavigationStage() {}

export function drawSpaceNavigationStage(
    p5: p5Types,
    cam: Camera,
    skyboxImg: Image,
    skyboxRadius: number,
    celestialObjects: Array<any>,
    setCelestialObjects: Function,
    ongoingCamMov: CameraMovement,
    cluster: Clusters,
    planetSelectedTexture: Image,
    jetbrainsMonoFont: Font,
    lowres: boolean,
    stage: Stages
) {
    p5.blendMode(p5.BLEND);
    p5.background(0, 0, 0);
    p5.cursor(p5.CROSS);

    p5.lights();
    p5.ambientLight(64);

    // Sky box
    p5.texture(skyboxImg!);
    p5.noStroke();
    p5.sphere(skyboxRadius, 24, 24);

    // Planets & sun
    // Must be sorted by distance for alpha to work

    setCelestialObjects(
        celestialObjects.sort(
            (p1, p2) => p2.getDistWithCam(p5, cam) - p1.getDistWithCam(p5, cam)
        )
    );
    celestialObjects
        .filter((o) => o.isInCluster(cluster))
        .forEach((o) =>
            o.draw(
                p5,
                cam,
                planetSelectedTexture,
                jetbrainsMonoFont,
                lowres,
                stage
            )
        );

    // Move camera
    handleCameraMovement(p5, cam, ongoingCamMov, skyboxRadius);
}

let oldCamPos = [0, 0, 0];

function handleCameraMovement(
    p5: p5Types,
    cam: Camera,
    ongoingCamMov: any,
    skyboxRadius: number
) {
    if (ongoingCamMov && !ongoingCamMov.isEnded(p5)) {
        ongoingCamMov.tick(p5, cam);

        return;
    }
    let x, zMove;

    // ORIGINAL HAS 3 ARGS window.p5.orbitControl(1, 1, 0.05);
    p5.orbitControl(1, 1);
    p5.perspective(p5.PI / 3, p5.width / p5.height, 1, skyboxRadius * 2);

    if (p5.keyIsDown(p5.LEFT_ARROW)) {
        x = 0.02 * 1.0; // this regulates the speed of the movement
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
        x = 0.02 * -1.0;
    } else {
        x = 0;
    }

    if (p5.keyIsDown(p5.UP_ARROW)) {
        zMove = -5 * 1.0;
    } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
        zMove = 5 * 1.0;
    } else {
        zMove = 0.0;
    }

    cam.pan(x);
    cam.move(0, 0, zMove);

    if (
        p5.dist(
            (cam as any).eyeX,
            (cam as any).eyeY,
            (cam as any).eyeZ,
            0,
            0,
            0
        ) >
        skyboxRadius * 0.75
    ) {
        cam.setPosition(oldCamPos[0], oldCamPos[1], oldCamPos[2]);
    } else {
        oldCamPos[0] = (cam as any).eyeX;
        oldCamPos[1] = (cam as any).eyeY;
        oldCamPos[2] = (cam as any).eyeZ;
    }
}
