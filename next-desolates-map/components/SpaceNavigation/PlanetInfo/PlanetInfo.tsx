/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import CameraMovement from "../../../core/modules/CameraMovement";
import { SpaceRendererContext } from "../../../pages/_app";
import Loader from "../../Loader/Loader";

export default function PlanetInfo() {
    const { p5, cam, selectedPlanet, setSelectedPlanet, setOngoingCamMov } =
        useContext(SpaceRendererContext);

    const [loadingOwner, setLoadingOwner] = useState(true);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

    const [loadingPlanetImage, setLoadingPlanetImage] = useState(true);

    async function fetchPlanetOwner() {
        const res = await fetch(
            `/api/ownerForToken/${selectedPlanet?.name.split("#")[1]}`
        );

        if (res.status == 200) {
            const data = await res.json();
            if (!data.error) {
                setOwnerAddress(data.ownerAddress);
            } else {
                setOwnerAddress(null);
            }
        }
        setLoadingOwner(false);
    }

    function planetImageLoaded() {
        setLoadingPlanetImage(false);
    }

    function visitPlanet() {
        if (selectedPlanet) {
            let tempOngoingCamMov = new CameraMovement(
                p5!,
                cam!,
                selectedPlanet.getPosVector(p5!),
                1500
            );

            tempOngoingCamMov.start(p5!);
            setOngoingCamMov(tempOngoingCamMov);
        }
    }

    useEffect(() => {
        if (selectedPlanet) {
            setLoadingPlanetImage(true);
            setOwnerAddress(null);
            setLoadingOwner(true);
            fetchPlanetOwner();
        }
    }, [selectedPlanet]);

    return (
        <SwitchTransition>
            <CSSTransition
                key={selectedPlanet?.name}
                timeout={250}
                classNames="fade"
            >
                <>
                    {selectedPlanet ? (
                        <div className="z-10 px-3 pt-2 pb-3 text-left transition-opacity duration-1000 ease-out rounded-lg opacity-100 text-primary font-cool w-80 backdrop-filter backdrop-blur outline-cool shadow-cool bg-faded">
                            <div className="relative w-full">
                                <p className="mb-2 text-lg">Planet info</p>
                                <button
                                    onClick={visitPlanet}
                                    className="absolute top-0 right-0 w-16 h-6 p-1 m-auto text-sm text-center transition-colors duration-200 rounded-lg hover:text-white hover:bg-primary outline-cool backdrop-filter backdrop-blur bg-faded"
                                >
                                    VISIT
                                </button>
                            </div>

                            <div className="flex items-center justify-center w-full h-24 mb-2 overflow-hidden rounded-lg outline-cool">
                                <Loader
                                    className={`${
                                        loadingPlanetImage ? "flex" : "hidden"
                                    }`}
                                    color="border-[#1BFFF1E6]"
                                />
                                <img
                                    className={`${
                                        loadingPlanetImage ? "hidden" : "flex"
                                    } w-full h-24`}
                                    src={selectedPlanet.image}
                                    alt={selectedPlanet.name}
                                    onLoad={planetImageLoaded}
                                />
                            </div>
                            <div className="hidden w-full h-24 mb-2 rounded-lg bg-faded animate-pulse outline-cool"></div>
                            <p>
                                Name:{" "}
                                <span className="select-text">
                                    #{selectedPlanet.name.split("#")[1]}
                                </span>
                            </p>
                            <p>
                                Owner:
                                <Link href="https://explorer.solana.com/address/Gi9azGeXawvDCaR5p6vHY98hMsU1BZSVZNzAdZSMP6UQ">
                                    <a
                                        target="_blank"
                                        className="underline select-text"
                                    >
                                        {loadingOwner
                                            ? "LOADING"
                                            : ownerAddress
                                            ? `${ownerAddress.substring(
                                                  0,
                                                  20
                                              )}...`
                                            : "Unclaimed"}
                                    </a>
                                </Link>
                            </p>
                            <div className="flex flex-row mt-2">
                                <Link href={selectedPlanet.link}>
                                    <a
                                        className="p-2 mr-3 text-sm text-center transition-colors duration-200 rounded-lg hover:text-white hover:bg-primary w-36 outline-cool backdrop-filter backdrop-blur bg-faded"
                                        target="_blank"
                                    >
                                        VIEW HASH
                                    </a>
                                </Link>
                                <button
                                    className="p-2 text-sm text-center transition-colors duration-200 rounded-lg w-36 hover:text-white hover:bg-primary outline-cool backdrop-filter backdrop-blur bg-faded"
                                    data-addr="Gi9azGeXawvDCaR5p6vHY98hMsU1BZSVZNzAdZSMP6UQ"
                                >
                                    SEE INHABITANTS
                                </button>
                            </div>
                            <div className="flex flex-row flex-wrap mt-2"></div>
                        </div>
                    ) : null}
                </>
            </CSSTransition>
        </SwitchTransition>
    );
}
