import p5Types, { Camera, Image } from "p5";

export function drawClusterSelectionStage(
    p5: p5Types,
    cam: Camera,
    skyboxImg: Image,
    skyboxRadius: number
) {
    p5.background(0, 0, 0);
    p5.lights();
    p5.ambientLight(128);

    // Sky box
    p5.texture(skyboxImg);
    p5.noStroke();
    p5.sphere(skyboxRadius, 24, 24);

    cam.setPosition(0, 0, -1750);
    cam.lookAt(250, 0, -2000);
}
