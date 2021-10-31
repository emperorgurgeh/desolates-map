import { Clusters } from "../../pages/_app";

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
    getForPlanet(x: number, y: number, z: number) {
        const clusterIdx =
            Math.ceil(x / 1000) +
            Math.ceil(y / 1000) * 2 +
            Math.ceil(z / 1000) * 4;

        return Object.values(Clusters)[clusterIdx];
    },

    getTransformedPos(pos: any) {
        const mod = function (n: number, m: number) {
            return ((n % m) + m) % m;
        };

        return pos.map((coord: number) => mod(coord, 1000) - 500);
    },
};
