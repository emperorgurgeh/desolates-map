import { useContext, useState } from "react";
import CameraMovement from "../../core/modules/CameraMovement";
import Planet from "../../core/modules/Planet";
import { SpaceRendererContext } from "../../pages/_app";
import { searchForPlanetAndChangeCluster } from "../RenderController/RenderController";

export default function PlanetSearch() {
    const {
        celestialObjects,
        cluster,
        p5,
        cam,
        setCluster,
        setOngoingCamMov,
        changeCurrentCluster,
    } = useContext(SpaceRendererContext);

    const [planetSearchInput, setPlanetSearchInput] = useState("");

    function handleInputChange(e: any) {
        setPlanetSearchInput(e.target.value);
    }

    function handleInputKeyDown(e: any) {
        if (e.key === "Enter") {
            console.log("ENTER PRESSED");
            searchForPlanetAndChangeCluster(
                planetSearchInput,
                p5!,
                cam!,
                setOngoingCamMov,
                celestialObjects,
                cluster,
                changeCurrentCluster
            );
        }
    }

    return (
        <div
            id="planet-search"
            className="z-10 px-3 pt-2 pb-3 mb-6 text-left transition-opacity duration-1000 ease-out rounded-lg opacity-100 text-primary font-cool w-80 backdrop-filter backdrop-blur outline-cool shadow-cool bg-faded"
        >
            <p className="mb-2 text-lg">Planet search</p>
            <div className="m-auto mb-4 w-72">
                <div className="flex items-center bg-black bg-opacity-75 rounded-lg outline-cool">
                    <div className="p-2 pt-3.5 pl-4">
                        <button
                            id="search-btn-sidebar"
                            className="outline-none hover:bg-transparent"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-primary"
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
                        id="search-input-sidebar"
                        type="text"
                        inputMode="numeric"
                        name="planet-no"
                        maxLength={4}
                        size={5}
                        className="w-full py-3 pr-4 text-lg text-right bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                        placeholder="420"
                        autoComplete="off"
                        value={planetSearchInput}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                    />
                </div>
            </div>
        </div>
    );
}
