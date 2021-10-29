import CelestialObject from "./CelestialObject";
import { Cluster } from "./Cluster";

import { Image, Font } from "p5";
import SpaceRenderer from "../SpaceRenderer";

export default class Planet extends CelestialObject {
    public origCoords: any;
    public radius: number;
    public textureImg: Image;
    public name: string;
    public image: Image;
    public link: any;
    public selected: boolean;
    public cluster: string;

    constructor(
        radius: number,
        textureImg: Image,
        pos: any,
        name: string,
        image: Image,
        link: any
        // planetSelectedTexture: Image
    ) {
        super(Cluster.getTransformedPos(pos));
        this.origCoords = pos;
        this.radius = radius;
        this.textureImg = textureImg;
        this.name = name;
        this.image = image;
        this.link = link;
        this.selected = false;
        this.cluster = Cluster.getForPlanet(pos[0], pos[1], pos[2]);
    }

    draw() {
        const spaceRenderer = SpaceRenderer.getInstance();
        const p5 = SpaceRenderer.getInstance().p5!;

        const distWithCam = p5.dist(
            (spaceRenderer.cam as any).eyeX,
            (spaceRenderer.cam as any).eyeY,
            (spaceRenderer.cam as any).eyeZ,
            this.x,
            this.y,
            this.z
        );

        p5.push();
        const detail = this._getLevelOfDetail();
        p5.translate(this.x, this.y, this.z);

        // ADD CONFIG
        // if (Config.stage == Stage.CLUSTER_TRANSITION) {
        //   // tint(random([0, 255]), random([0, 255]), random([0, 255]));
        // }
        p5.texture(this.textureImg);
        p5.sphere(this.radius, detail, detail);

        // Draw labels
        this._drawLabel(distWithCam);

        if (this.selected) {
            this._drawSelectionRing();
        }

        p5.pop();
    }

    isInCluster(cluster: string) {
        return this.cluster === cluster;
    }

    _drawLabel(distWithCam: number) {
        const spaceRenderer = SpaceRenderer.getInstance();
        const p5 = SpaceRenderer.getInstance().p5!;

        // ADD CONFIG
        // if (Config.stage != Stage.SPACE_NAVIGATION) return;

        if (distWithCam > 1500 || distWithCam < 50) {
            return;
        }

        let opacity;
        if (distWithCam > 300) {
            opacity = p5.map(distWithCam, 1000, 1500, 255, 0);
        } else {
            opacity = p5.map(distWithCam, 100, 50, 255, 0);
        }

        p5.fill(255, opacity);

        p5.textFont(spaceRenderer.jetbrainsMonoFont!);
        p5.textAlign(p5.LEFT, p5.CENTER);

        let deltaX = (spaceRenderer.cam as any).eyeX - (this.x + 20);
        let deltaY = (spaceRenderer.cam as any).eyeY - this.y;
        let deltaZ = (spaceRenderer.cam as any).eyeZ - this.z;

        p5.push();
        p5.rotateY(Math.atan2(deltaX, deltaZ));
        p5.rotateX(
            Math.atan(
                -deltaY / Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2))
            )
        );

        p5.textSize(12);
        p5.text(this.name, 15, -15);
        // textSize(10);
        // text(this.owner, 20, 0);
        p5.pop();
    }

    _drawSelectionRing() {
        const spaceRenderer = SpaceRenderer.getInstance();
        const p5 = SpaceRenderer.getInstance().p5!;

        p5.push();
        let deltaX = (spaceRenderer.cam as any).eyeX - this.x;
        let deltaY = (spaceRenderer.cam as any).eyeY - this.y;
        let deltaZ = (spaceRenderer.cam as any).eyeZ - this.z;

        p5.rotateY(Math.atan2(deltaX, deltaZ));
        p5.rotateX(
            Math.atan(
                -deltaY / Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2))
            )
        );

        //planetSelectedTexture possibly null
        p5.texture(SpaceRenderer.getInstance().planetSelectedTexture!);
        p5.plane(this.radius * 4, this.radius * 4);
        p5.pop();
    }

    setSelected(value: boolean) {
        this.selected = value;
    }

    isSelected = () => this.selected;

    isMouseOver(mouseX: number, mouseY: number) {
        const p5 = SpaceRenderer.getInstance().p5!;

        const CLICKABLE_THRESHOLD = 2000;

        // ADD CONFIG
        // if (Config.cluster != this.cluster) return false;

        const r = this.radius,
            x = this.x,
            y = this.y,
            z = this.z;

        const distWithCam = this.getDistWithCam();

        if (distWithCam > CLICKABLE_THRESHOLD) return false;

        // Retrieve the left most and right-most 2d projection points
        // for a cube surrounding the sphere
        // TODO: this could be done more accurately and probably efficiently
        // if I just do math.. need to just find a point in the sphere surface
        let smallestX, biggestX, smallestY, biggestY;
        for (let px = x - r; px <= x + r; px += 2 * r) {
            for (let py = y - r; py <= y + r; py += 2 * r) {
                for (let pz = z - r; pz <= z + r; pz += 2 * r) {
                    const screenPoint = (p5 as any).screenPosition(px, py, pz);
                    screenPoint.x += p5.width / 2;
                    screenPoint.y += p5.height / 2;

                    if (!smallestX) {
                        smallestX = screenPoint.x;
                    } else if (
                        screenPoint.x < smallestX &&
                        screenPoint.x >= 0
                    ) {
                        smallestX = screenPoint.x;
                    }

                    if (!biggestX) {
                        biggestX = screenPoint.x;
                    } else if (
                        screenPoint.x > biggestX &&
                        screenPoint.x <= p5.width
                    ) {
                        biggestX = screenPoint.x;
                    }

                    // Bottom defined as Y is lowest
                    if (!smallestY) {
                        smallestY = screenPoint.y;
                    } else if (
                        screenPoint.y < smallestY &&
                        screenPoint.y >= 0
                    ) {
                        smallestY = screenPoint.y;
                    }

                    if (!biggestY) {
                        biggestY = screenPoint.y;
                    } else if (
                        screenPoint.y > biggestY &&
                        screenPoint.y <= p5.height
                    ) {
                        biggestY = screenPoint.y;
                    }
                }
            }
        }

        if (
            p5.mouseX >= smallestX &&
            p5.mouseX <= biggestX &&
            p5.mouseY >= smallestY &&
            p5.mouseY <= biggestY
        ) {
            return true;
        } else {
            return false;
        }
    }

    _getLevelOfDetail() {
        const distWithCam = this.getDistWithCam();

        if (SpaceRenderer.getInstance().LOW_RES) {
            if (distWithCam < 100) {
                return 12;
            } else if (distWithCam < 500) {
                return 8;
            } else if (distWithCam < 1000) {
                return 6;
            } else {
                return 4;
            }
        } else {
            if (distWithCam < 100) {
                return 24;
            } else if (distWithCam < 500) {
                return 12;
            } else if (distWithCam < 1000) {
                return 8;
            } else {
                return 4;
            }
        }
    }
}
