import { Camera, Image } from "p5";
import CelestialObject from "./CelestialObject";

// TODO support suns outside of (0,0,0)
// TODO support suns outside of (0,0,0)
export default class Sun extends CelestialObject {
    public radius: number;
    public textureImg: Image;
    constructor(
        radius: number,
        textureImg: Image,
        pos: [number, number, number]
    ) {
        super(pos);
        this.radius = radius;
        this.textureImg = textureImg;
    }

    draw(p5: any, cam: Camera) {
        p5.push();
        p5.rotateY(Math.atan2((cam as any).eyeX, (cam as any).eyeZ));
        p5.rotateX(
            Math.atan(
                -(cam as any).eyeY /
                    Math.sqrt(
                        Math.pow((cam as any).eyeX, 2) +
                            Math.pow((cam as any).eyeZ, 2)
                    )
            )
        );
        p5.texture(this.textureImg);
        p5.plane(this.radius, this.radius);
        p5.pop();
    }

    isInCluster() {
        return true;
    }
}
