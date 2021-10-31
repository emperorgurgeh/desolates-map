import p5Types, { Image } from "p5";

export function drawClusterSelectionStage(
    p5: p5Types,
    skyboxImg: Image,
    skyboxRadius: number
) {
    p5.background(0, 0, 0);
    p5.lights();
    p5.ambientLight(64);

    // Sky box
    p5.texture(skyboxImg);
    p5.noStroke();
    p5.sphere(skyboxRadius, 24, 24);
}

// export function _loadClusterSelectionStage() {
//   select("#nav-container").removeClass("hidden");

//   selectAll(".btn-cluster").forEach((b) =>
//     b.mouseClicked(function (e) {
//       Cluster.changeCurrentCluster(
//         Config,
//         e.target.getAttribute("data-cluster")
//       );

//       ongoingCamMov = new CameraMovement(
//         cam,
//         createVector(0, 0, 0),
//         2000,
//         1000
//       );
//       ongoingCamMov.start();

//       console.info(`cluster selected: ${Config.cluster}`);
//       changeStage(Stage.SPACE_NAVIGATION);
//     })
//   );

//   select("#search-btn").mouseClicked(function () {
//     _searchForPlanetAndChangeStage();
//   });

//   select("#search-input").elt.onkeypress = function (e) {
//     if (!e) e = window.event;
//     const keyCode = e.code || e.key;
//     if (keyCode == "Enter") {
//       _searchForPlanetAndChangeStage();
//       return false;
//     }
//   };

//   cam.setPosition(0, 0, -1750);
//   cam.lookAt(250, 0, -2000);
// }

// export function _unloadClusterSelectionStage() {
//   selectAll(".btn-cluster").forEach((b) => b.mouseClicked(false));

//   select("#search-btn").mouseClicked(false);

//   select("#search-input").elt.onkeypress = null;

//   select("#nav-container").addClass("hidden");
// }
