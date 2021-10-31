// const SKYBOX_RADIUS = 5000;

import p5Types, { Camera, Font, Image } from "p5";
import { useContext } from "react";
import { Clusters, SpaceRendererContext, Stages } from "../../pages/_app";
// import { ongoingCamMov } from "../../components/RenderController/RenderController";

// TODO refactor: this should be a class extending a generic Stage class,
// With draw, mouseclicked, load and unload functions
export default function SpaceNavigationStage() {}

export function drawSpaceNavigationStage(
    p5: p5Types,
    cam: Camera,
    skyboxImg: Image,
    skyboxRadius: number,
    celestialObjects: Array<any>,
    setCelestialObjects: Function,
    ongoingCamMov: any,
    cluster: Clusters,
    planetSelectedTexture: Image,
    jetbrainsMonoFont: Font,
    lowres: boolean,
    stage: Stages
) {
    p5.blendMode(p5.BLEND);
    p5.background(0, 0, 0);
    p5.cursor(p5.CROSS);

    p5.lights();
    p5.ambientLight(64);

    // Sky box
    p5.texture(skyboxImg!);
    p5.noStroke();
    p5.sphere(skyboxRadius, 24, 24);

    // Planets & sun
    // Must be sorted by distance for alpha to work

    setCelestialObjects(
        celestialObjects.sort(
            (p1, p2) => p2.getDistWithCam(p5, cam) - p1.getDistWithCam(p5, cam)
        )
    );
    celestialObjects
        .filter((o) => o.isInCluster(cluster))
        .forEach((o) =>
            o.draw(
                p5,
                cam,
                planetSelectedTexture,
                jetbrainsMonoFont,
                lowres,
                stage
            )
        );

    // Move camera
    handleCameraMovement(p5, cam, ongoingCamMov, skyboxRadius);
}

let oldCamPos = [0, 0, 0];

function handleCameraMovement(
    p5: p5Types,
    cam: Camera,
    ongoingCamMov: any,
    skyboxRadius: number
) {
    if (ongoingCamMov && !ongoingCamMov.isEnded(p5)) {
        ongoingCamMov.tick(p5, cam);

        return;
    }
    let x, zMove;

    // ORIGINAL HAS 3 ARGS window.p5.orbitControl(1, 1, 0.05);
    p5.orbitControl(1, 1);
    p5.perspective(p5.PI / 3, p5.width / p5.height, 1, skyboxRadius * 2);

    if (p5.keyIsDown(p5.LEFT_ARROW)) {
        x = 0.02 * 1.0; // this regulates the speed of the movement
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
        x = 0.02 * -1.0;
    } else {
        x = 0;
    }

    if (p5.keyIsDown(p5.UP_ARROW)) {
        zMove = -5 * 1.0;
    } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
        zMove = 5 * 1.0;
    } else {
        zMove = 0.0;
    }

    cam.pan(x);
    cam.move(0, 0, zMove);

    if (
        p5.dist(
            (cam as any).eyeX,
            (cam as any).eyeY,
            (cam as any).eyeZ,
            0,
            0,
            0
        ) >
        (p5 as any).SKYBOX_RADIUS * 0.75
    ) {
        cam.setPosition(oldCamPos[0], oldCamPos[1], oldCamPos[2]);
    } else {
        oldCamPos[0] = (cam as any).eyeX;
        oldCamPos[1] = (cam as any).eyeY;
        oldCamPos[2] = (cam as any).eyeZ;
    }
}

// COMMMENTED OUT TEMPORARILY

// let clusterSelectListenerRegistered = false;

// function _loadSpaceNavigationStage() {
//     // Show cluster name at the top
//     select("#cluster-name")
//         .removeClass("hidden")
//         .addClass("autohide-10s")
//         .html(`${Config.cluster} cluster`);

//     // Show cluster info panel
//     select("#cluster-info").removeClass("opacity-0").addClass("opacity-100");
//     const clusterSelect = select("#cluster-select");
//     clusterSelect.elt.selectedIndex = Cluster.NAMES.indexOf(Config.cluster);

//     if (!clusterSelectListenerRegistered) {
//         clusterSelect.changed(function () {
//             Cluster.changeCurrentCluster(Config, clusterSelect.value(), true);
//         });
//         clusterSelectListenerRegistered = true;
//     }

//     select("#cluster-image").elt.src = `assets/sprites/${Config.cluster}.png`;

//     // Show planet search
//     select("#planet-search").removeClass("opacity-0").addClass("opacity-100");
//     select("#search-btn-sidebar").mouseClicked(function () {
//         _searchForPlanetAndChangeCluster();
//     });

//     select("#search-input-sidebar").elt.onkeypress = function (e) {
//         if (!e) e = window.event;
//         const keyCode = e.code || e.key;
//         if (keyCode == "Enter") {
//             _searchForPlanetAndChangeCluster();
//             return false;
//         }
//     };

//     // Show planet info panel if there's at least one selected planet in this cluster
//     const selectedPlanets = celestialObjects.filter(
//         (o) => o.isSelected() && o.isInCluster(Config.cluster)
//     );
//     if (selectedPlanets.length > 0) {
//         select("#planet-info")
//             .removeClass("opacity-0")
//             .removeClass("hidden")
//             .addClass("opacity-100");
//         loadPlanetInfoFor(selectedPlanets[0]);
//     }
// }

// function _unloadSpaceNavigationStage() {
//     select("#cluster-name")
//         .addClass("hidden")
//         .removeClass("autohide-10s")
//         .html("");

//     select("#cluster-info").addClass("opacity-0").removeClass("opacity-100");
//     select("#cluster-select").changed(false);

//     select("#planet-search").addClass("opacity-0").removeClass("opacity-100");
//     select("#search-btn-sidebar").mouseClicked(false);
//     select("#search-input-sidebar").elt.onkeypress = null;

//     select("#planet-info")
//         .addClass("opacity-0")
//         .addClass("hidden")
//         .removeClass("opacity-100");

//     // TODO: unload requests from planet info (if any)
// }

// // TODO move to its own class?
// function loadPlanetInfoFor(planet) {
//     fetch(`/api/ownerForToken/${planet.name.split("#")[1]}`)
//         .then((response) => response.json())
//         .then((data) => {
//             // TODO check the panel hasn't been unloaded or switched to another planet
//             if (data.ownerAddress) {
//                 select("#planet-owner").html(
//                     `${data.ownerAddress.substring(0, 20)}...`
//                 ).elt.href = `https://explorer.solana.com/address/${data.ownerAddress}`;
//                 // TODO set view frens as enabled
//                 select("#view-nft-btn").attribute(
//                     "data-addr",
//                     data.ownerAddress
//                 );
//             } else {
//                 select("#planet-owner").html("Unclaimed");
//             }
//         });

//     let titleElem = document.getElementById("planet-name");
//     titleElem.innerHTML = planet.name;

//     let linkElem = document.getElementById("planet-link");
//     linkElem.href = planet.link;

//     let imgElem = document.getElementById("planet-image");
//     let imgElemPlaceholder = document.getElementById(
//         "planet-image-placeholder"
//     );

//     imgElem.src = planet.image;

//     imgElemPlaceholder.classList.remove("hidden");
//     imgElem.classList.add("hidden");

//     imgElem.addEventListener("load", (event) => {
//         imgElem.classList.remove("hidden");
//         imgElemPlaceholder.classList.add("hidden");
//     });

//     let visitPlanetBtnElem = document.getElementById("nav-btn");
//     visitPlanetBtnElem.addEventListener("click", function () {
//         ongoingCamMov = new CameraMovement(cam, planet.getPosVector(p5), 1500);
//         ongoingCamMov.start();
//     }); // TODO do i need to remove the listener?

//     let viewNFTsBtnElem = document.getElementById("view-nft-btn");
//     viewNFTsBtnElem.addEventListener("click", function () {
//         const addr = select("#view-nft-btn").attribute("data-addr");
//         _loadOtherNFTsForAddress(addr);
//     }); // TODO do i need to remove the listener?

//     select("#planet-info")
//         .removeClass("opacity-0")
//         .removeClass("hidden")
//         .addClass("opacity-100");
// }

// function _loadOtherNFTsForAddress(ownerAddress) {
//     // TODO filter out current nft
//     console.info(`Began loading NFTs for address ${ownerAddress}`);
//     // TODO check and abort if the panel has been unloaded or switched to another planet

//     fetch(`/api/allNFTsForOwner/${ownerAddress}`)
//         .then((response) => response.json())
//         .then((data) => {
//             console.info(`Finished loading NFTs for address ${ownerAddress}`);
//             // TODO what if there's 0 NFTs?

//             const imgCont = select("#other-nft-list");

//             data.nfts.forEach((nft) => {
//                 let img = createImg(nft.image, "nft");
//                 img.parent(imgCont);
//             });
//         });
// }

// function _searchForPlanetAndChangeCluster() {
//     const query = select("#search-input-sidebar").value();
//     planetSearch(
//         query,
//         function (p) {
//             print(`Found ${p.name}`);

//             // Set planet as selected
//             for (let po of celestialObjects) {
//                 po.setSelected(false);
//             }
//             p.setSelected(true);

//             if (p.cluster === Config.cluster) {
//                 // Just move to planet
//                 ongoingCamMov = new CameraMovement(cam, p.getPosVector(), 1500);
//                 ongoingCamMov.start();
//             } else {
//                 // Change cluster
//                 Cluster.changeCurrentCluster(Config, p.cluster, true);
//             }

//             return false; // Stops search
//         },
//         function () {
//             alert("Planet not found :sad_astronaut:");
//         }
//     );
// }
