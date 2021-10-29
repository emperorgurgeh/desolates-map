import SpaceRenderer from "../SpaceRenderer";

export default class CelestialObject {
    public x: number;
    public y: number;
    public z: number;

    constructor(pos: [number, number, number]) {
        this.x = pos[0];
        this.y = pos[1];
        this.z = pos[2];
    }

    getDistWithCam() {
        const cam = SpaceRenderer.getInstance().cam;
        const p5 = SpaceRenderer.getInstance().p5!;

        return p5.dist(
            (cam as any).eyeX,
            (cam as any).eyeY,
            (cam as any).eyeZ,
            this.x,
            this.y,
            this.z
        );
    }

    draw() {
        throw Error("draw() must be implemented");
    }

    isMouseOver(mouseX: number, mouseY: number) {
        return false;
    }

    //Causing ts error currently
    setSelected(value: boolean) {}

    isSelected() {
        return false;
    }

    getPosVector() {
        const p5 = SpaceRenderer.getInstance().p5!;
        return p5.createVector(this.x, this.y, this.z);
    }

    isInCluster(cluster: string) {
        throw Error("isInCluster() must be implemented");
    }
}
