import p5 from "p5";
import p5Types, { Font, Image } from "p5";

import CelestialObject from "./modules/CelestialObject";
import { Cluster } from "./modules/Cluster";
import Config from "./modules/Config";
import Planet from "./modules/Planet";

declare global {
    interface Window {
        p5: p5;
    }
}

export default class SpaceRenderer {
    private static instance: SpaceRenderer;

    public p5?: p5Types | any;

    public celestialObjects: Array<CelestialObject> = [];
    public cam?: p5Types.Camera;
    public LOW_RES: boolean = false;

    public jetbrainsMonoFont?: Font;
    public robotoRegFont?: Font;

    public planetSelectedTexture?: Image;
    public planetTextures: any = {};
    public skyboxImg?: Image;
    public sunImg?: Image;

    public SKYBOX_RADIUS: number = 5000;
    public SUN_RADIUS: number = 150;
    public PLANET_RADIUS: number = 10;
    public TEXTURE_SUFFIX: string = this.LOW_RES ? "_low_res" : "";

    public framerates: Array<number> = [];
    public avgFrameRate: number = 60;

    public ongoingCamMov?: any;

    public stage: any = Object.freeze({
        LOADING: 0,
        CLUSTER_SELECTION: 1,
        CLUSTER_TRANSITION: 2,
        SPACE_NAVIGATION: 3,
        toString: (idx: number) =>
            Object.keys(this.stage).filter((k) => this.stage[k] == idx)[0],
    });

    public config: Config = new Config();

    private constructor() {}

    static getInstance(): SpaceRenderer {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }

    public loadPlanets(sources: Array<string>) {
        let planets: Array<any> = [];
        this._loadPlanetsRec(sources, 0, planets);
    }

    public async _loadPlanetsRec(
        sources: Array<string>,
        idx: number,
        planetJson: any
    ) {
        if (idx >= sources.length) {
            this._initAfterPlanetsLoad(planetJson);
        } else {
            await fetch(sources[idx])
                .then((response) => response.json())
                .then((json) => {
                    planetJson = planetJson.concat(json);
                    this._loadPlanetsRec(sources, idx + 1, planetJson);
                });
        }
    }

    public _initAfterPlanetsLoad(planetJson: any) {
        planetJson.forEach((p: any) => {
            const textureImg = this.planetTextures[p.attributes.palette];

            const planet = new Planet(
                this.PLANET_RADIUS,
                textureImg,
                p.attributes.coords,
                p.name.split("DESOLATEs ")[1],
                p.image,
                p.link
            );

            this.celestialObjects.push(planet);
        });

        this.parseURLParamsAndInit();
    }

    public parseURLParamsAndInit() {
        const urlParams = this.p5.getURLParams();

        // if (urlParams.mypl) {
        //     myPlanets = urlParams.mypl.split(",");
        //     print(myPlanets);
        //     // TODO replace for something more useful, or remove altogether
        //     myPlanets.forEach((p) => {
        //         planetSearch(p, (found) => found.setSelected(true));
        //     });
        // }

        const clusterParam = urlParams.cluster
            ? urlParams.cluster.toLowerCase()
            : undefined;
        if (clusterParam && Cluster.NAMES.includes(clusterParam)) {
            this.config.cluster = clusterParam;
            console.info(`cluster selected: ${clusterParam}`);
            this.config.changeStage(this.stage.SPACE_NAVIGATION);
        } else {
            console.info(`No cluster selected`);
            this.config.changeStage(this.stage.CLUSTER_SELECTION);
        }
    }
}
