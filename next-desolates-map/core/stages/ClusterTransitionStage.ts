import p5Types, { Camera, Font, Image } from "p5";
import { Clusters, Stages } from "../../pages/_app";
import Skybox from "../modules/Skybox";

const INITIAL_WARP_SPEED = 2;
const WARP_SPEED_INC_PER_FRAME = 0.3;

export function drawClusterTransitionStage(
    p5: p5Types,
    cam: Camera,
    celestialObjects: Array<any>,
    setCelestialObjects: Function,
    fromCluster: Clusters,
    changeStage: Function,
    frozenCamCenter: any,
    warpspeed: number,
    setWarpspeed: Function,
    lastDist: number,
    setLastDist: Function,
    planetSelectedTexture: Image,
    jetbrainsMonoFont: Font,
    lowres: boolean,
    stage: Stages,
    skybox: Skybox
) {
    p5.blendMode(p5.LIGHTEST);

    // Sky box
    skybox.draw(p5);

    p5.lights();
    p5.ambientLight(128);

    p5.push();
    p5.fill("white");
    p5.translate(frozenCamCenter.x, frozenCamCenter.y, frozenCamCenter.z);
    p5.sphere(20);
    p5.pop();

    // Planets & sun
    // Must be sorted by distance for alpha to work
    setCelestialObjects(
        celestialObjects.sort(
            (p1, p2) => p2.getDistWithCam(p5, cam) - p1.getDistWithCam(p5, cam)
        )
    );

    celestialObjects
        .filter((o) => o.isInCluster(fromCluster))
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
    setWarpspeed(warpspeed + WARP_SPEED_INC_PER_FRAME); // TODO should be time delta based

    // warpspeed = min(warpspeed, 10.0); // There seems to be a bug where if speed goes beyond 10, alpha channels breaks
    cam.move(0, 0, -1 * warpspeed);

    const oldLastDist = lastDist;
    let tempLastDist = p5.dist(
        frozenCamCenter.x,
        frozenCamCenter.y,
        frozenCamCenter.z,
        (cam as any).eyeX,
        (cam as any).eyeY,
        (cam as any).eyeZ
    );

    setLastDist(tempLastDist);

    if (tempLastDist - oldLastDist > 0) {
        changeStage(Stages.SPACE_NAVIGATION);
        cam.setPosition(0, 0, -1250);
        cam.lookAt(0, 0, 0);
    }
}

export function _loadClusterTransitionStage(
    p5: p5Types,
    cam: Camera,
    setFrozenCamCenter: Function,
    cluster: Clusters,
    setWarpspeed: Function,
    setFromCluster: Function,
    setLastDist: Function
) {
    let tempFrozenCamCenter = {
        x: (cam as any).centerX,
        y: (cam as any).centerY,
        z: (cam as any).centerZ,
    };

    setFrozenCamCenter(tempFrozenCamCenter);

    setWarpspeed(INITIAL_WARP_SPEED);
    setFromCluster(cluster);

    setLastDist(
        p5.dist(
            tempFrozenCamCenter.x,
            tempFrozenCamCenter.y,
            tempFrozenCamCenter.z,
            (cam as any).eyeX,
            (cam as any).eyeY,
            (cam as any).eyeZ
        )
    );
}

export function _unloadClusterTransitionStage(
    setFrozenCamCenter: Function,
    setFromCluster: Function,
    setLastDist: Function
) {
    setFrozenCamCenter(null);
    setFromCluster(null);
    setLastDist(null);
}
