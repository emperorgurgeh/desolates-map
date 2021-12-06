import { Image } from "p5";

export default class Skybox {
    public radius: number;
    public textureMap: Map<string, Image>;

    constructor(radius: number, textureMap: Map<string, Image>) {
        this.radius = radius;
        this.textureMap = textureMap;
    }

    draw(p5: any) {
        p5.noStroke();

        p5.push();
        p5.translate(0, 0, this.radius);
        p5.texture(this.textureMap.get("back"));
        p5.plane(this.radius * 2, this.radius * 2);
        p5.pop();

        p5.push();
        p5.translate(0, 0, -this.radius);
        p5.texture(this.textureMap.get("front"));
        p5.plane(this.radius * 2, this.radius * 2);
        p5.pop();

        p5.push();
        p5.translate(0, this.radius, 0);
        p5.rotateX(p5.HALF_PI);
        p5.texture(this.textureMap.get("bottom"));
        p5.plane(this.radius * 2, this.radius * 2);
        p5.pop();

        p5.push();
        p5.translate(0, -this.radius, 0);
        p5.rotateX(p5.HALF_PI);
        p5.texture(this.textureMap.get("top"));
        p5.plane(this.radius * 2, this.radius * 2);
        p5.pop();

        p5.push();
        p5.translate(-this.radius, 0, 0);
        p5.rotateY(p5.HALF_PI);
        p5.texture(this.textureMap.get("left"));
        p5.plane(this.radius * 2, this.radius * 2);
        p5.pop();

        p5.push();
        p5.translate(this.radius, 0, 0);
        p5.rotateY(p5.HALF_PI);
        p5.texture(this.textureMap.get("right"));
        p5.plane(this.radius * 2, this.radius * 2);
        p5.pop();
    }
}
