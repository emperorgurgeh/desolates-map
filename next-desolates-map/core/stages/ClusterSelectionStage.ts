import p5Types, { Camera, Image } from "p5";
import Skybox from "../modules/Skybox";

export function drawClusterSelectionStage(
    p5: p5Types,
    cam: Camera,
    skybox: Skybox
) {
    p5.background(0, 0, 0);

    // Sky box
    skybox.draw(p5);

    cam.setPosition(0, 0, -1750);
    cam.lookAt(250, 0, -2000);
}
