// import Sketch from "react-p5";
import p5Types, { Camera } from "p5";
import dynamic from "next/dynamic";
import { useContext, useRef } from "react";

import { Clusters, SpaceRendererContext, Stages } from "../../pages/_app";

import { PALETTE_TO_COLOR_MAP } from "../../utils/SpaceRenderer/consts";
import { drawSpaceNavigationStage } from "../../core/stages/SpaceNavigationStage";
import { drawClusterSelectionStage } from "../../core/stages/ClusterSelectionStage";

import CameraMovement from "../../core/modules/CameraMovement";
import Sun from "../../core/modules/Sun";
import Planet from "../../core/modules/Planet";

import { addScreenPositionFunction } from "../../js/lib/3dposition";
import { drawClusterTransitionStage } from "../../core/stages/ClusterTransitionStage";
import CelestialObject from "../../core/modules/CelestialObject";

const Sketch = dynamic(import("react-p5"), {
    ssr: false,
});

let framerates: Array<number> = [];
let avgFrameRate = 60;

export default function RenderController() {
    const {
        p5,
        setP5,
        textureSuffix,
        setSkyboxImg,
        sunRadius,
        sunImg,
        setSunImg,
        planetTextures,
        setPlanetTextures,
        setPlanetSelectedTexture,
        setRobotoRegFont,
        setJetbainsMonoFont,
        cam,
        setCam,
        celestialObjects,
        setCelestialObjects,
        stage,
        changeStage,
        setCluster,
        planetRadius,
        skyboxImg,
        skyboxRadius,
        ongoingCamMov,
        setOngoingCamMov,
        cluster,
        planetSelectedTexture,
        jetbrainsMonoFont,
        lowres,
        selectedPlanet,
        setSelectedPlanet,
        fromCluster,
        setFromCluster,
        frozenCamCenter,
        setFrozenCamCenter,
        warpspeed,
        setWarpspeed,
        lastDist,
        setLastDist,
        changeCurrentCluster,
    } = useContext(SpaceRendererContext);

    const camRef = useRef<Camera>();

    function loadPlanets(sources: Array<string>) {
        let planets: Array<any> = [];
        _loadPlanetsRec(sources, 0, planets);
    }

    function _loadPlanetsRec(
        sources: Array<string>,
        idx: number,
        planetJson: any
    ) {
        if (idx >= sources.length) {
            _initAfterPlanetsLoad(planetJson);
        } else {
            fetch(sources[idx])
                .then((response) => response.json())
                .then((json) => {
                    planetJson = planetJson.concat(json);
                    _loadPlanetsRec(sources, idx + 1, planetJson);
                });
        }
    }

    async function _initAfterPlanetsLoad(planetJson: any) {
        const celestialRet: Array<any> = [];
        planetJson.forEach((p: any) => {
            const textureImg = planetTextures[p.attributes.palette];

            const planet = new Planet(
                planetRadius,
                textureImg,
                p.attributes.coords,
                p.name.split("DESOLATEs ")[1],
                p.image,
                p.link
            );

            celestialRet.push(planet);
        });

        const sun = loadSun();
        celestialRet.push(sun);

        const loadedCelestialObjects = celestialObjects.concat([
            ...celestialRet,
        ]);

        setCelestialObjects(loadedCelestialObjects);

        parseURLParamsAndInit(loadedCelestialObjects);
    }

    function loadSun() {
        const sun = new Sun(sunRadius, sunImg!, [0, 0, 0]);
        return sun;
    }

    function parseURLParamsAndInit(
        celestialObjectArray: Array<CelestialObject>
    ) {
        if (p5) {
            const urlParams = p5.getURLParams() as any;

            // ?planet=<planetId> loads a specific planet
            const planetParam = parseInt(urlParams.planet);
            if (planetParam) {
                const planet = celestialObjectArray.find(
                    (o) => o.id === planetParam
                );
                if (planet && planet instanceof Planet) {
                    planet.setSelected(true);
                    setSelectedPlanet(planet);

                    // Select cluster
                    changeCurrentCluster(planet.cluster, false, true);

                    // Initiate a camera movement towards the planet
                    const tempOngoingCamMov = new CameraMovement(
                        p5,
                        camRef.current!,
                        planet.getPosVector(p5),
                        3000,
                        125
                    );
                    tempOngoingCamMov.start(p5);

                    setOngoingCamMov(tempOngoingCamMov);

                    changeStage(Stages.SPACE_NAVIGATION);
                    return;
                } else {
                    console.error(`Planet with id ${planetParam} not found`);
                }
            }

            // ?cluster=<clusterName> loads a specific cluster
            const clusterParam = urlParams.cluster
                ? urlParams.cluster.toLowerCase()
                : undefined;
            if (
                clusterParam &&
                Object.values(Clusters).includes(clusterParam)
            ) {
                changeCurrentCluster(clusterParam);
                console.info(`cluster selected: ${clusterParam}`);
                changeStage(Stages.SPACE_NAVIGATION);
            } else {
                console.info(`No cluster selected`);
                changeStage(Stages.CLUSTER_SELECTION);
            }
        } else {
            console.warn("p5 not initialized in context");
        }
    }

    function preload(p5: p5Types) {
        setP5(p5);

        setSkyboxImg(
            p5.loadImage(`assets/skybox/eso_milkyway${textureSuffix}.jpg`)
        );

        setSunImg(p5.loadImage("assets/sprites/lensflare0.png"));

        let tempPlanetTextures: any = {};
        Object.keys(PALETTE_TO_COLOR_MAP).forEach((c) => {
            tempPlanetTextures[c] = p5.loadImage(
                `assets/planets/${c}${textureSuffix}.png`
            );
        });

        setPlanetTextures(tempPlanetTextures);

        setPlanetSelectedTexture(p5.loadImage(`assets/sprites/ring.png`));

        setRobotoRegFont(p5.loadFont("assets/fonts/Roboto-Regular.ttf"));
        setJetbainsMonoFont(p5.loadFont("assets/fonts/JetBrainsMono200.ttf"));
    }

    function setup(p5: p5Types, canvasParentRef: Element) {
        const canvas = p5
            .createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL)
            .parent(canvasParentRef)
            .id("p5canvas");

        let tempCamp = p5.createCamera();
        setCam(tempCamp);
        camRef.current = tempCamp;

        tempCamp.setPosition(0, 0, 2500);
        tempCamp.lookAt(0, 0, 0);
        p5.setAttributes("antialias", true);
        addScreenPositionFunction(p5);

        loadPlanets([
            "data/first-mission.json",
            "data/second-mission.json",
            "data/second-mission-addendum.json",
            "data/second-mission-second-addendum.json",
            "data/third-mission.json",
        ]);

        // TODO: work around firefox bug that doesn'r properly position
        // canvas under parent
        const isFirefox = /firefox/i.test(navigator.userAgent);
        if (isFirefox) {
            setTimeout(() => {
                p5.select("#p5canvas")!.parent(canvasParentRef);
            }, 100);
        }
    }

    function draw(p5: p5Types) {
        // console.log(celestialObjects);

        switch (stage) {
            case Stages.LOADING:
                // TODO implement loading screen
                // drawLoadingScreen();
                break;
            case Stages.CLUSTER_SELECTION:
                drawClusterSelectionStage(p5, cam!, skyboxImg!, skyboxRadius);
                break;
            case Stages.CLUSTER_TRANSITION:
                drawClusterTransitionStage(
                    p5!,
                    cam!,
                    celestialObjects,
                    setCelestialObjects,
                    fromCluster!,
                    changeStage,
                    frozenCamCenter,
                    warpspeed!,
                    setWarpspeed,
                    lastDist!,
                    setLastDist,
                    planetSelectedTexture!,
                    jetbrainsMonoFont!,
                    lowres,
                    stage,
                    skyboxImg!,
                    skyboxRadius
                );
                break;
            case Stages.SPACE_NAVIGATION:
                drawSpaceNavigationStage(
                    p5,
                    cam!,
                    skyboxImg!,
                    skyboxRadius,
                    celestialObjects,
                    setCelestialObjects,
                    ongoingCamMov,
                    cluster,
                    planetSelectedTexture!,
                    jetbrainsMonoFont!,
                    lowres,
                    stage
                );
                break;
        }

        framerates.push(p5.frameRate());
        if (framerates.length >= 200) {
            framerates.shift();
            avgFrameRate =
                framerates.reduce((a, b) => a + b) / framerates.length;
        }
    }

    function windowResized(p5: p5Types) {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    function mouseClicked(p5: p5Types) {
        let matches = celestialObjects.filter((o) =>
            o.isMouseOver(p5, cam, p5.mouseX, p5.mouseY, cluster)
        );

        if (matches.length > 0) {
            const o = matches.pop()!;
            console.log(`clicked on ${(o as Planet).name}`);

            loadPlanetInfoFor(o);

            for (let p of celestialObjects) {
                p.setSelected(false);
            }
            o.setSelected(true);
        }
    }

    async function loadPlanetInfoFor(planet: Planet) {
        console.log(planet);
        setSelectedPlanet(planet);
    }

    function doubleClicked(p5: p5Types) {
        let matches = celestialObjects.filter((o) =>
            o.isMouseOver(p5, cam, p5.mouseX, p5.mouseY, cluster)
        );

        if (matches.length > 0) {
            const o = matches.pop()!;
            console.log(
                `double clicked on ${(o as any).name} at ${o.getPosVector(p5)}`
            );

            for (let p of celestialObjects) {
                p.setSelected(false);
            }
            o.setSelected(true);

            const tempOngoingCamMov = new CameraMovement(
                p5,
                cam!,
                o.getPosVector(p5),
                1500
            );
            tempOngoingCamMov.start(p5);

            setOngoingCamMov(tempOngoingCamMov);
        }
    }

    return (
        <Sketch
            setup={setup}
            draw={draw}
            preload={preload}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            windowResized={windowResized}
            mouseClicked={mouseClicked}
            doubleClicked={doubleClicked}
        />
    );
}

export function searchForPlanetAndChangeCluster(
    query: string,
    p5: p5Types,
    cam: Camera,
    setOngoingCamMov: Function,
    setSelectedPlanet: Function,
    celestialObjects: Array<any>,
    currentCluster: Clusters,
    changeCluster: Function
) {
    planetSearch(
        query,
        (p: Planet) => {
            console.log(`Found ${p.name}`);

            // Set planet as selected
            for (let po of celestialObjects) {
                po.setSelected(false);
            }
            p.setSelected(true);
            setSelectedPlanet(p);

            // Change cluster if necessary
            if (p.cluster != currentCluster) {
                changeCluster(p.cluster, true, true);
            }

            // Start cam movement to planet
            const tempOngoingCamMov = new CameraMovement(
                p5!,
                cam!,
                p.getPosVector(p5!),
                1500
            );
            tempOngoingCamMov.start(p5!);
            setOngoingCamMov(tempOngoingCamMov);

            return false;
        },
        () => {
            alert("Planet not found :sad_astronaut:");
        },
        celestialObjects
    );
}

export function searchForPlanetAndChangeStage(
    query: string,
    p5: p5Types,
    cam: Camera,
    setOngoingCamMov: Function,
    celestialObjects: Array<any>,
    setCluster: Function,
    changeStage: Function,
    setSelectedPlanet: Function
) {
    planetSearch(
        query,
        function (p: Planet) {
            console.log(`Found ${p.name}`);

            // Set planet as selected
            for (let po of celestialObjects) {
                po.setSelected(false);
            }
            p.setSelected(true);

            setSelectedPlanet(p);

            // Select cluster
            setCluster(p.cluster);

            // Initiate a camera movement towards the planet
            const tempOngoingCamMov = new CameraMovement(
                p5,
                cam,
                p.getPosVector(p5),
                3000,
                125
            );
            tempOngoingCamMov.start(p5);
            setOngoingCamMov(tempOngoingCamMov);

            changeStage(Stages.SPACE_NAVIGATION);

            return false; // Stops search
        },
        function () {
            alert("Planet not found :sad_astronaut:");
        },
        celestialObjects
    );
}

export function planetSearch(
    query: string,
    callbackFound: Function,
    callbackNotFound: Function,
    celestialObjects: Array<any>
) {
    query = query.trim();

    let oneOrMoreMatches = false;

    for (let o of celestialObjects) {
        let isMatch = false;
        if (!o.name) continue;

        const oNumber = o.name.split("#")[1].trim();

        for (let i = query.length; i <= oNumber.length; i++) {
            let paddedQuery = query.padStart(i, "0");
            if (paddedQuery === oNumber) {
                isMatch = true;
                oneOrMoreMatches = true;
                break;
            }
        }

        if (isMatch) {
            let cont = callbackFound(o);
            if (!cont) break;
        }
    }

    if (!oneOrMoreMatches) {
        callbackNotFound();
    }
}
