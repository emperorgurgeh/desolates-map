import "../styles/globals.css";
import type { AppProps } from "next/app";

import RenderController from "../components/RenderController/RenderController";
import { createContext, useEffect, useState } from "react";
import p5Types, { Camera, Font, Image } from "p5";
import Planet from "../core/modules/Planet";
import {
    _loadClusterTransitionStage,
    _unloadClusterTransitionStage,
} from "../core/stages/ClusterTransitionStage";
import { useRouter } from "next/dist/client/router";

import * as Fathom from "fathom-client";
import Skybox from "../core/modules/Skybox";

export const SpaceRendererContext = createContext<ISpaceRenderer>(
    {} as ISpaceRenderer
);

declare global {
    interface Window {
        p5: p5Types;
    }
}

interface ISpaceRenderer {
    p5?: p5Types;
    setP5: Function;
    cam?: Camera;
    setCam: Function;

    ongoingCamMov: any;
    setOngoingCamMov: Function;

    stage: Stages;
    changeStage: Function;
    cluster: Clusters;
    setCluster: Function;
    changeCurrentCluster: Function;

    celestialObjects: Array<any>;
    setCelestialObjects: Function;

    jetbrainsMonoFont?: Font;
    setJetbainsMonoFont: Function;
    robotoRegFont?: Font;
    setRobotoRegFont: Function;

    planetSelectedTexture?: Image;
    setPlanetSelectedTexture: Function;
    planetTextures: any;
    setPlanetTextures: Function;

    skybox?: Skybox;
    setSkybox: Function;
    sunImg?: Image;
    setSunImg: Function;

    sunRadius: number;
    setSunRadius: Function;
    planetRadius: number;
    setPlanetRadius: Function;

    lowres: boolean;
    setLowres: Function;
    textureSuffix: string;
    setTextureSuffix: Function;

    selectedPlanet?: Planet;
    setSelectedPlanet: Function;

    fromCluster?: Clusters;
    setFromCluster: Function;
    frozenCamCenter: any;
    setFrozenCamCenter: Function;
    warpspeed?: number;
    setWarpspeed: Function;
    lastDist?: number;
    setLastDist: Function;
}

export enum Stages {
    LOADING = "LOADING",
    CLUSTER_SELECTION = "CLUSTER_SELECTION",
    CLUSTER_TRANSITION = "CLUSTER_TRANSITION",
    SPACE_NAVIGATION = "SPACE_NAVIGATION",
}

export enum Clusters {
    ALPHA = "alpha",
    BETA = "beta",
    GAMMA = "gamma",
    DELTA = "delta",
    EPSILON = "epsilon",
    ZETA = "zeta",
    ETA = "eta",
    THETA = "theta",
}

export const clusterToGreekLetterMap = new Map([
    [Clusters.ALPHA, "α"],
    [Clusters.BETA, "β"],
    [Clusters.GAMMA, "γ"],
    [Clusters.DELTA, "δ"],
    [Clusters.EPSILON, "ε"],
    [Clusters.ZETA, "ζ"],
    [Clusters.ETA, "η"],
    [Clusters.THETA, "θ"],
]);

function MyApp({ Component, pageProps }: AppProps) {
    const [p5, setP5] = useState<p5Types | undefined>(undefined);
    const [cam, setCam] = useState<Camera | undefined>(undefined);
    const [ongoingCamMov, setOngoingCamMov] = useState<any>(undefined);

    const [stage, setStage] = useState<Stages>(Stages.LOADING);
    const [cluster, setCluster] = useState<Clusters>(Clusters.ALPHA);

    const [celestialObjects, setCelestialObjects] = useState<Array<any>>([]);

    const [jetbrainsMonoFont, setJetbainsMonoFont] = useState<Font | undefined>(
        undefined
    );
    const [robotoRegFont, setRobotoRegFont] = useState<Font | undefined>(
        undefined
    );

    const [planetSelectedTexture, setPlanetSelectedTexture] = useState<
        Image | undefined
    >(undefined);
    const [planetTextures, setPlanetTextures] = useState<any>({});
    const [skybox, setSkybox] = useState<Skybox | undefined>(undefined);
    const [sunImg, setSunImg] = useState<Image | undefined>(undefined);

    const [sunRadius, setSunRadius] = useState<number>(150);
    const [planetRadius, setPlanetRadius] = useState<number>(10);

    const [lowres, setLowres] = useState<boolean>(false);
    const [textureSuffix, setTextureSuffix] = useState<string>(
        lowres ? "_low_res" : ""
    );

    const [selectedPlanet, setSelectedPlanet] = useState<Planet | undefined>(
        undefined
    );

    const [fromCluster, setFromCluster] = useState<Clusters | undefined>(
        undefined
    );
    const [frozenCamCenter, setFrozenCamCenter] = useState<any>(undefined);
    const [warpspeed, setWarpspeed] = useState<number | undefined>(undefined);
    const [lastDist, setLastDist] = useState<number | undefined>(undefined);

    function changeCurrentCluster(
        newCluster: Clusters,
        transitionViaWarpspeed = false,
        withPlanetSelected = false
    ) {
        if (transitionViaWarpspeed) {
            changeStage(Stages.CLUSTER_TRANSITION);
        }

        console.info(`Changing cluster to ${newCluster}`);
        setCluster(newCluster);

        // Deselect any selected planet from other cluster
        if (
            !withPlanetSelected &&
            selectedPlanet &&
            !selectedPlanet.isInCluster(newCluster)
        ) {
            selectedPlanet.setSelected(false);
            setSelectedPlanet(undefined);
        }
    }

    function changeStage(newStage: Stages) {
        console.info(`Transitioning stage from: ${stage} to ${newStage}`);

        if (stage == newStage) {
            console.warn(`Already in stage ${newStage}`);
            // console.trace();
        }

        _unloadStage(stage);
        _loadStage(newStage);
        setStage(newStage);
    }

    function _loadStage(newStage: Stages) {
        switch (newStage) {
            case Stages.LOADING:
                break;
            case Stages.CLUSTER_SELECTION:
                // _loadClusterSelectionStage(cam!);
                break;
            case Stages.CLUSTER_TRANSITION:
                _loadClusterTransitionStage(
                    p5!,
                    cam!,
                    setFrozenCamCenter,
                    cluster,
                    setWarpspeed,
                    setFromCluster,
                    setLastDist
                );
                break;
            case Stages.SPACE_NAVIGATION:
                // _loadSpaceNavigationStage();
                break;
        }
    }

    function _unloadStage(oldStage: Stages) {
        switch (oldStage) {
            case Stages.LOADING:
                break;
            case Stages.CLUSTER_SELECTION:
                // _unloadClusterSelectionStage();
                break;
            case Stages.CLUSTER_TRANSITION:
                _unloadClusterTransitionStage(
                    setFrozenCamCenter,
                    setFromCluster,
                    setLastDist
                );
                break;
            case Stages.SPACE_NAVIGATION:
                // _unloadSpaceNavigationStage();
                break;
        }
    }

    if (
        process.env.NEXT_PUBLIC_FATHOM_SITE_ID &&
        process.env.NEXT_PUBLIC_SITE_URL
    ) {
        const router = useRouter();

        useEffect(() => {
            Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID!, {
                includedDomains: [process.env.NEXT_PUBLIC_SITE_URL!],
            });

            function onRouteChangeComplete() {
                Fathom.trackPageview();
            }
            // Record a pageview when route changes
            router.events.on("routeChangeComplete", onRouteChangeComplete);

            // Unassign event listener
            return () => {
                router.events.off("routeChangeComplete", onRouteChangeComplete);
            };
        }, []);
    } else {
        console.warn("Fathom not configured");
    }

    return (
        <SpaceRendererContext.Provider
            value={{
                p5,
                setP5,
                cam,
                setCam,
                stage,
                changeStage,
                cluster,
                setCluster,
                changeCurrentCluster,
                celestialObjects,
                setCelestialObjects,
                jetbrainsMonoFont,
                setJetbainsMonoFont,
                robotoRegFont,
                setRobotoRegFont,
                planetSelectedTexture,
                setPlanetSelectedTexture,
                planetTextures,
                setPlanetTextures,
                skybox,
                setSkybox,
                sunImg,
                setSunImg,
                sunRadius,
                setSunRadius,
                planetRadius,
                setPlanetRadius,
                lowres,
                setLowres,
                textureSuffix,
                setTextureSuffix,
                ongoingCamMov,
                setOngoingCamMov,
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
            }}
        >
            <div className="relative flex items-center justify-center w-full h-screen max-h-screen min-h-screen">
                <RenderController />
                <Component {...pageProps} />
            </div>
        </SpaceRendererContext.Provider>
    );
}
export default MyApp;
