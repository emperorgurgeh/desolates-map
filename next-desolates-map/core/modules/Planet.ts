import { Cluster } from "./Cluster";
import CelestialObject from "./CelestialObject";

import p5Types, { Image, Font, Camera } from "p5";
import { Clusters, Stages } from "../../pages/_app";

export default class Planet extends CelestialObject {
    public origCoords: any;
    public radius: number;
    public textureImg: Image;
    public name: string;
    public image: string;
    public link: any;
    public selected: boolean;
    public cluster: Clusters;
    public ownerAddress?: string;

    constructor(
        radius: number,
        textureImg: Image,
        pos: any,
        name: string,
        image: string,
        link: any
    ) {
        super(
            Cluster.getTransformedPos(pos),
            parseInt(name.split("#")[1].trim())
        );
        this.origCoords = pos;
        this.radius = radius;
        this.textureImg = textureImg;
        this.name = name;
        this.image = image;
        this.link = link;
        this.selected = false;
        this.cluster = Cluster.getForPlanet(pos[0], pos[1], pos[2]);
    }

    draw(
        p5: p5Types,
        cam: Camera,
        planetSelectedTexture: Image,
        labelFont: Font,
        lowres: boolean,
        stage: Stages
    ) {
        const distWithCam = p5.dist(
            (cam as any).eyeX,
            (cam as any).eyeY,
            (cam as any).eyeZ,
            this.x,
            this.y,
            this.z
        );

        const isMouseOver = this.isMouseOver(
            p5,
            cam,
            p5.mouseX,
            p5.mouseY,
            this.cluster
        );

        p5.push();
        const detail = this._getLevelOfDetail(p5, cam, lowres);
        p5.translate(this.x, this.y, this.z);

        p5.push();

        // Rotate each planet
        p5.rotateX(this.id / 360);
        p5.rotateY(this.id / 180);

        p5.texture(this.textureImg);
        p5.sphere(this.radius, detail, detail);

        p5.pop();

        // Draw labels & selection ring
        if (stage == Stages.SPACE_NAVIGATION) {
            if (isMouseOver || this.selected) {
                this._drawLabel(p5, cam, distWithCam, labelFont);
            }

            if (this.selected) {
                this._drawSelectionRing(p5, cam, planetSelectedTexture);
            }
        }

        p5.pop();
    }

    isInCluster(cluster: string) {
        return this.cluster === cluster;
    }

    _drawLabel(p5: p5Types, cam: Camera, distWithCam: number, labelFont: Font) {
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

        p5.textFont(labelFont!);
        p5.textAlign(p5.LEFT, p5.CENTER);

        let deltaX = (cam as any).eyeX - (this.x + 20);
        let deltaY = (cam as any).eyeY - this.y;
        let deltaZ = (cam as any).eyeZ - this.z;

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

    _drawSelectionRing(p5: p5Types, cam: Camera, planetSelectedTexture: Image) {
        p5.push();
        let deltaX = (cam as any).eyeX - this.x;
        let deltaY = (cam as any).eyeY - this.y;
        let deltaZ = (cam as any).eyeZ - this.z;

        p5.rotateY(Math.atan2(deltaX, deltaZ));
        p5.rotateX(
            Math.atan(
                -deltaY / Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2))
            )
        );

        p5.texture(planetSelectedTexture);
        p5.plane(this.radius * 4, this.radius * 4);
        p5.pop();
    }

    setSelected(value: boolean) {
        this.selected = value;
        if (value) {
            // TODO: Should we append the param instead of replacing the entire query?
            window.history.replaceState(null, "", `?planet=${this.id}`);
        }
    }

    isSelected = () => this.selected;

    isMouseOver(
        p5: p5Types,
        cam: Camera,
        mouseX: number,
        mouseY: number,
        cluster: Clusters
    ) {
        const CLICKABLE_THRESHOLD = 2000;

        if (cluster != this.cluster) return false;

        const r = this.radius,
            x = this.x,
            y = this.y,
            z = this.z;

        const distWithCam = this.getDistWithCam(p5, cam);

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
            mouseX >= smallestX &&
            mouseX <= biggestX &&
            mouseY >= smallestY &&
            mouseY <= biggestY
        ) {
            return true;
        } else {
            return false;
        }
    }

    _getLevelOfDetail(p5: p5Types, cam: Camera, lowres: boolean) {
        const distWithCam = this.getDistWithCam(p5, cam);

        if (lowres) {
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

    setOwnerAddress(ownerAddress: string) {
        this.ownerAddress = ownerAddress;
    }
}
