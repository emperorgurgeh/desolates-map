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
const Cluster = {

  NAMES: [
    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
    "zeta",
    "eta",
    "theta"
  ],

  getGreekLetterFromName(name) {
    switch (name) {
      case "alpha": return "α";
      case "beta": return "β";
      case "gamma": return "γ";
      case "delta": return "δ";
      case "epsilon": return "ε";
      case "zeta": return "ζ";
      case "eta": return "η";
      case "theta": return "θ";
    }
  },

  getForPlanet(planet) {
    const clusterIdx =
        ceil(planet.x / 1000)
        + ceil(planet.y / 1000) * 2
        + ceil(planet.z / 1000) * 4;

    return Cluster.NAMES[clusterIdx];
  },

  getTransformedPos(pos) {
    const mod = function(n, m) {
      return ((n % m) + m) % m;
    }

    return pos.map(coord => mod(coord, 1000) * 2 - 1000);
  }

}
