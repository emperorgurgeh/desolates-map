import p5Types, { Camera, Vector } from "p5";

export default class CameraMovement {
    private origin: Vector;
    private originLookAt: Vector;
    private dest: any;
    private distance: number;
    private durationMillis: number;

    private startTime?: number;
    private lastTickMillis?: number;

    constructor(
        p5: p5Types,
        cam: Camera,
        dest: any,
        durationMillis: number,
        stopBeforeDest = 100
    ) {
        this.origin = p5.createVector(
            (cam as any).eyeX,
            (cam as any).eyeY,
            (cam as any).eyeZ
        );
        this.originLookAt = p5.createVector(
            (cam as any).centerX,
            (cam as any).centerY,
            (cam as any).centerZ
        );
        this.dest = dest;
        this.distance = Math.max(
            this.origin.dist(this.dest) - stopBeforeDest,
            0
        );
        this.durationMillis = durationMillis;
    }

    start(p5: p5Types) {
        this.startTime = p5.millis();
        this.lastTickMillis = this.startTime;
    }

    isEnded(p5: p5Types) {
        return (
            this.startTime && p5.millis() > this.startTime + this.durationMillis
        );
    }

    tick(p5: p5Types, cam: Camera) {
        const curTime = p5.millis();
        const timeEllapsed = curTime - this.startTime!;

        if (timeEllapsed > this.durationMillis) {
            console.warn("Called tick on a camera movement that had ended");
            return;
        }

        const curCamLookAt = (window.p5 as any).Vector.lerp(
            this.originLookAt,
            this.dest,
            timeEllapsed / this.durationMillis
        );

        cam.lookAt(curCamLookAt.x + 0, curCamLookAt.y + 0, curCamLookAt.z + 0);

        const movement =
            -1 *
            (curTime - this.lastTickMillis!) *
            (this.distance / this.durationMillis);
        cam.move(0, 0, movement);

        this.lastTickMillis = curTime;
    }
}
