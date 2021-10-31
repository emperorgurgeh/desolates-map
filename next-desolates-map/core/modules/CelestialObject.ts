import p5Types, { Camera, Font, Image } from "p5";
import { Clusters, Stages } from "../../pages/_app";

export default class CelestialObject {
    public x: number;
    public y: number;
    public z: number;

    constructor(pos: [number, number, number]) {
        this.x = pos[0];
        this.y = pos[1];
        this.z = pos[2];
    }

    getDistWithCam(p5: p5Types, cam: Camera) {
        return p5.dist(
            (cam as any).eyeX,
            (cam as any).eyeY,
            (cam as any).eyeZ,
            this.x,
            this.y,
            this.z
        );
    }

    draw(
        p5: p5Types,
        cam: Camera,
        planetSelectedTexture: Image,
        labelFont: Font,
        lowres: boolean,
        stage: Stages
    ) {
        throw Error("draw() must be implemented");
    }

    isMouseOver(
        p5: p5Types,
        cam: Camera,
        mouseX: number,
        mouseY: number,
        cluster: Clusters
    ) {
        return false;
    }

    //Causing ts error currently
    setSelected(value: boolean) {}

    isSelected() {
        return false;
    }

    getPosVector(p5: p5Types) {
        return p5.createVector(this.x, this.y, this.z);
    }

    isInCluster(cluster: string) {
        throw Error("isInCluster() must be implemented");
    }
}
