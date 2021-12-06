import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { preventEventPropagation } from "../../utils/displayUtils";
import ClusterSelection from "./ClusterSelection";
import Inhabitants from "./Inhabitants";
import PlanetInfo from "./PlanetInfo";
import PlanetSearch from "./PlanetSearch";

export default function SpaceNavigation() {
    const [showInhabitants, setShowInhabitants] = useState(false);

    return (
        <div
            className="absolute top-0 right-0 flex flex-col max-h-screen p-4 overflow-y-auto select-none no-scrollbar"
            onWheel={preventEventPropagation}
            onClick={preventEventPropagation}
            onDoubleClick={preventEventPropagation}
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
