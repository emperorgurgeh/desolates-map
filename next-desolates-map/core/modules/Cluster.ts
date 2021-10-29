import Planet from "./Planet";

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
    NAMES: [
        "alpha",
        "beta",
        "gamma",
        "delta",
        "epsilon",
        "zeta",
        "eta",
        "theta",
    ],

    getGreekLetterFromName(name: string) {
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

    getForPlanet(x: number, y: number, z: number) {
        const clusterIdx =
            Math.ceil(x / 1000) +
            Math.ceil(y / 1000) * 2 +
            Math.ceil(z / 1000) * 4;

        return Cluster.NAMES[clusterIdx];
    },

    getTransformedPos(pos: any) {
        const mod = function (n: number, m: number) {
            return ((n % m) + m) % m;
        };

        return pos.map((coord: number) => mod(coord, 1000) - 500);
    },

    changeCurrentCluster(
        Config: any,
        cluster: string,
        transitionViaWarpspeed = false
    ) {
        // select("#cluster-image").elt.src = `assets/sprites/${cluster}.png`;

        // if (transitionViaWarpspeed) {
        //     changeStage(Stage.CLUSTER_TRANSITION);
        // }

        // TODO deselect any selected planet
        console.info(`Changing cluster to ${cluster}`);
        Config.cluster = cluster;
    },
};
