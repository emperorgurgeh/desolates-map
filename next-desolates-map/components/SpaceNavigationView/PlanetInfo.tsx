/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import CameraMovement from "../../core/modules/CameraMovement";
import { SpaceRendererContext } from "../../pages/_app";
import Loader from "../Loader/Loader";
import UserProfileChip from "./OwnerProfileChip";

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

            if (!selectedPlanet?.ownerAddress) {
                setOwnerAddress(null);
                setLoadingOwner(true);
                fetchPlanetOwner();
            } else {
                setLoadingOwner(false);
                setOwnerAddress(selectedPlanet.ownerAddress);
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
                                    className="absolute top-0 right-0 w-auto h-6 p-0 m-auto text-sm text-center transition-colors duration-200 rounded-lg hover:text-white hover:bg-primary"
                                    title="Zoom in planet"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                        />
                                    </svg>
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
                                <Link href={selectedPlanet.link}>
                                    <a
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.nativeEvent.stopImmediatePropagation();
                                        }}
                                        className="pl-2 text-sm text-left underline"
                                        target="_blank"
                                    >
                                        (View hash)
                                    </a>
                                </Link>
                            </p>
                            <UserProfileChip
                                loadingOwner={loadingOwner}
                                ownerAddress={ownerAddress}
                                selectedPlanet={selectedPlanet}
                            />
                            <div className="flex flex-row mt-2">
                                <Link
                                    href={`https://planet.desolate.space/${selectedPlanet.id}`}
                                >
                                    <a
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.nativeEvent.stopImmediatePropagation();
                                        }}
                                        className="p-2 mr-3 text-sm text-center transition-colors duration-200 rounded-lg hover:text-white hover:bg-primary w-36 outline-cool backdrop-filter backdrop-blur bg-faded"
                                    >
                                        OPEN (3D)
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
