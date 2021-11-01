import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import ClusterSelection from "./ClusterSelection";
import Inhabitants from "./Inhabitants";
import PlanetInfo from "./PlanetInfo";
import PlanetSearch from "./PlanetSearch";

export default function SpaceNavigation() {
    const [showInhabitants, setShowInhabitants] = useState(false);

    // Stop propagation of scrolling so that the map zoom doesn't change
    // when the user scrolls on the navigation bar.
    function handleScroll(e: any) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    return (
        <div
            className="absolute top-0 right-0 flex flex-col max-h-screen p-4 overflow-y-auto select-none no-scrollbar"
            onWheel={handleScroll}
        >
            <ClusterSelection />
            <PlanetSearch />
            <PlanetInfo
                showInhabitants={showInhabitants}
                setShowInhabitants={setShowInhabitants}
            />
            <CSSTransition
                in={showInhabitants}
                classNames="fade"
                timeout={300}
                unmountOnExit
            >
                <Inhabitants />
            </CSSTransition>
        </div>
    );
}
