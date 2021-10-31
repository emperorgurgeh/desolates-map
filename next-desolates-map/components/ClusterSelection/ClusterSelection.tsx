import { useContext, useState } from "react";
import CameraMovement from "../../core/modules/CameraMovement";
import { Clusters, SpaceRendererContext, Stages } from "../../pages/_app";
import {
    searchForPlanetAndChangeCluster,
    searchForPlanetAndChangeStage,
} from "../RenderController/RenderController";

export default function ClusterSelection() {
    const {
        changeStage,
        p5,
        cam,
        setOngoingCamMov,
        celestialObjects,
        setCluster,
        setSelectedPlanet,
    } = useContext(SpaceRendererContext);

    const [planetSearchInput, setPlanetSearchInput] = useState("");

    function handleInputChange(e: any) {
        setPlanetSearchInput(e.target.value);
    }

    function handleKeyDown(e: any) {
        if (e.key === "Enter") {
            console.log("ENTER PRESSED");
            searchForPlanet();
        }
    }

    function searchForPlanet() {
        searchForPlanetAndChangeStage(
            planetSearchInput,
            p5!,
            cam!,
            setOngoingCamMov,
            celestialObjects,
            setCluster,
            changeStage,
            setSelectedPlanet
        );
    }

    return (
        <div className="z-10 flex flex-col items-center w-11/12 h-auto px-3 md:px-8 lg:px-16 py-10 rounded-lg md:w-3/4 lg:w-1/2 backdrop-filter backdrop-blur outline-cool shadow-cool bg-faded max-w-[700px]">
            <p className="text-lg font-cool text-primary">Find your planet</p>

            <div className="my-8 flex items-center w-full bg-black bg-opacity-75 rounded-lg max-w-[20rem] outline-cool">
                <div className="p-2 pt-3 pl-4">
                    <button
                        onClick={searchForPlanet}
                        className="transition-opacity duration-200 outline-none hover:opacity-60 text-primary"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 "
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                        </svg>
                    </button>
                </div>
                <input
                    id="search-input"
                    type="text"
                    inputMode="numeric"
                    name="planet-no"
                    maxLength={4}
                    size={5}
                    className="w-full py-3 pr-4 text-lg text-right bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                    placeholder="420"
                    value={planetSearchInput}
                    onChange={handleInputChange}
                    autoComplete="off"
                    onKeyDown={handleKeyDown}
                ></input>
            </div>

            <hr className="h-px m-auto mb-8 border-none w-120 bg-faded" />

            <p className="mb-6 text-lg font-cool text-primary">
                Or explore by cluster
            </p>

            <div className="grid grid-cols-2 max-w-[600px] w-full gap-x-5 gap-y-3 font-cool text-primary">
                {/* Convert this to map from the Clusters enum */}
                <ClusterButton cluster={Clusters.ALPHA} />
                <ClusterButton cluster={Clusters.BETA} />
                <ClusterButton cluster={Clusters.GAMMA} />
                <ClusterButton cluster={Clusters.DELTA} />
                <ClusterButton cluster={Clusters.EPSILON} />
                <ClusterButton cluster={Clusters.ZETA} />
                <ClusterButton cluster={Clusters.ETA} />
                <ClusterButton cluster={Clusters.THETA} />
            </div>
        </div>
    );
}

interface IClusterButton {
    cluster: Clusters;
}

function ClusterButton({ cluster }: IClusterButton) {
    const {
        changeStage,
        ongoingCamMov,
        setOngoingCamMov,
        p5,
        cam,
        setCluster,
        changeCurrentCluster,
    } = useContext(SpaceRendererContext);

    function handleClick(e: any) {
        console.log("CLUSTER SELECTED:", cluster);
        // Cluster.changeCurrentCluster(
        //     Config,
        //     e.target.getAttribute("data-cluster")
        // );

        changeCurrentCluster(cluster);

        let tempCamMov = new CameraMovement(
            p5!,
            cam!,
            p5!.createVector(0, 0, 0),
            2000,
            1000
        );

        tempCamMov.start(p5!);

        setOngoingCamMov(tempCamMov);

        // TEMP
        changeStage(Stages.SPACE_NAVIGATION);
    }

    return (
        <button
            onClick={handleClick}
            className="w-full p-4 text-left transition-colors duration-200 rounded-lg outline-cool backdrop-filter backdrop-blur bg-faded hover:text-white hover:bg-primary"
        >
            <p>{cluster.charAt(0).toUpperCase() + cluster.slice(1)} cluster</p>
        </button>
    );
}
