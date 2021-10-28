/**
 * alpha α
 * beta β
 * gamma γ
 * delta δ
 * epsilon ε
 * zeta ζ
 * eta η
 * theta θ
 */
export const Cluster = {
  NAMES: ["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta"],

  getGreekLetterFromName(name) {
    switch (name) {
      case "alpha":
        return "α";
      case "beta":
        return "β";
      case "gamma":
        return "γ";
      case "delta":
        return "δ";
      case "epsilon":
        return "ε";
      case "zeta":
        return "ζ";
      case "eta":
        return "η";
      case "theta":
        return "θ";
    }
  },

  getForPlanet(planet) {
    const clusterIdx =
      Math.ceil(planet.x / 1000) +
      Math.ceil(planet.y / 1000) * 2 +
      Math.ceil(planet.z / 1000) * 4;

    return Cluster.NAMES[clusterIdx];
  },

  getTransformedPos(pos) {
    const mod = function (n, m) {
      return ((n % m) + m) % m;
    };

    return pos.map((coord) => mod(coord, 1000) - 500);
  },

  changeCurrentCluster(Config, cluster, transitionViaWarpspeed = false) {
    select("#cluster-image").elt.src = `assets/sprites/${cluster}.png`;

    if (transitionViaWarpspeed) {
      changeStage(Stage.CLUSTER_TRANSITION);
    }

    // TODO deselect any selected planet
    console.info(`Changing cluster to ${cluster}`);
    Config.cluster = cluster;
  },
};
