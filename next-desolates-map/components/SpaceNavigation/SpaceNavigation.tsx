import ClusterSelection from "./ClusterSelection";
import PlanetInfo from "./PlanetInfo/PlanetInfo";
import PlanetSearch from "./PlanetSearch";

export default function SpaceNavigation() {
    return (
        <div className="absolute top-0 right-0 flex flex-col max-h-screen p-4 overflow-y-auto">
            <ClusterSelection />
            <PlanetSearch />
            <PlanetInfo />
        </div>
    );
}
