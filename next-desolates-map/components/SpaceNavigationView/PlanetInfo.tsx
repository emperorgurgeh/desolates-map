/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import CameraMovement from "../../core/modules/CameraMovement";
import { SpaceRendererContext } from "../../pages/_app";
import Loader from "../Loader/Loader";

export default function PlanetInfo({
    showInhabitants,
    setShowInhabitants,
}: any) {
    const { p5, cam, selectedPlanet, setOngoingCamMov } =
        useContext(SpaceRendererContext);

    const [loadingOwner, setLoadingOwner] = useState(true);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

    const [loadingPlanetImage, setLoadingPlanetImage] = useState(true);

    async function fetchPlanetOwner() {
        const res = await fetch(
            `/api/ownerForToken/${selectedPlanet!.name.split("#")[1]}`
        );

        if (res.status == 200) {
            const data = await res.json();
            if (!data.error) {
                setOwnerAddress(data.ownerAddress);
                selectedPlanet!.setOwnerAddress(data.ownerAddress);
            } else {
                setOwnerAddress(null);
            }
        }
        setLoadingOwner(false);
    }

    function planetImageLoaded() {
        setLoadingPlanetImage(false);
    }

    function visitPlanet(e: any) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

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
            if (showInhabitants) {
                setShowInhabitants(false);
            }

            setLoadingPlanetImage(true);
            setOwnerAddress(null);
            setLoadingOwner(true);
            if (!selectedPlanet?.ownerAddress) {
                fetchPlanetOwner();
            }
        }
    }, [selectedPlanet]);

    function handleToggleInhabitants(e: any) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        setShowInhabitants(!showInhabitants);
    }

    return (
        <SwitchTransition>
            <CSSTransition
                key={selectedPlanet?.name}
                timeout={250}
                classNames="fade"
            >
                <>
                    {selectedPlanet ? (
                        <div className="z-10 px-3 pt-2 pb-3 mb-6 text-left transition-opacity duration-1000 ease-out rounded-lg opacity-100 text-primary font-cool w-80 backdrop-filter backdrop-blur outline-cool shadow-cool bg-faded">
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
                                <Link
                                    href={`https://explorer.solana.com/address/${selectedPlanet?.ownerAddress}`}
                                >
                                    <a
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.nativeEvent.stopImmediatePropagation();
                                        }}
                                        target="_blank"
                                        className={`${
                                            loadingOwner ? "" : "underline"
                                        } select-text`}
                                    >
                                        {selectedPlanet?.ownerAddress ? (
                                            `${selectedPlanet?.ownerAddress.substring(
                                                0,
                                                20
                                            )}...`
                                        ) : (
                                            <>
                                                {loadingOwner
                                                    ? "LOADING"
                                                    : ownerAddress
                                                    ? `${ownerAddress.substring(
                                                          0,
                                                          20
                                                      )}...`
                                                    : "Unclaimed"}
                                            </>
                                        )}
                                    </a>
                                </Link>
                            </p>
                            <div className="flex flex-row mt-2">
                                <Link href={selectedPlanet.link}>
                                    <a
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.nativeEvent.stopImmediatePropagation();
                                        }}
                                        className="p-2 mr-3 text-sm text-center transition-colors duration-200 rounded-lg hover:text-white hover:bg-primary w-36 outline-cool backdrop-filter backdrop-blur bg-faded"
                                        target="_blank"
                                    >
                                        VIEW HASH
                                    </a>
                                </Link>
                                <button
                                    disabled={!selectedPlanet.ownerAddress}
                                    onClick={handleToggleInhabitants}
                                    className={`p-2 text-sm text-center transition-colors duration-200 rounded-lg disabled:opacity-50 w-36 ${
                                        !selectedPlanet.ownerAddress
                                            ? ""
                                            : "hover:text-white hover:bg-primary"
                                    } outline-cool backdrop-filter backdrop-blur bg-faded`}
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
