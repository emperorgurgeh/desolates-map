import type { NextPage } from "next";
import { useContext } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import ClusterSelection from "../components/ClusterSelection/ClusterSelection";
import Loader from "../components/Loader/Loader";
import SpaceNavigation from "../components/SpaceNavigation/SpaceNavigation";

import { SpaceRendererContext, Stages } from "./_app";

const Home: NextPage = (spaceRenderer) => {
    const { stage } = useContext(SpaceRendererContext);

    return (
        <>
            <h1
                className="absolute z-10 text-3xl text-white select-none top-6"
                style={{ fontFamily: "Zen Dots" }}
            >
                DESOLATEs
            </h1>
            <SwitchTransition>
                <CSSTransition key={stage} classNames="fade" timeout={300}>
                    <>
                        {stage == Stages.LOADING && (
                            <div className="z-10 flex items-center justify-center w-full h-full bg-black">
                                <Loader color="border-white" />
                            </div>
                        )}
                        {stage == Stages.CLUSTER_SELECTION && (
                            <ClusterSelection />
                        )}
                        {stage == Stages.CLUSTER_TRANSITION && null}
                        {stage == Stages.SPACE_NAVIGATION && (
                            <SpaceNavigation />
                        )}
                    </>
                </CSSTransition>
            </SwitchTransition>
        </>
    );
    return null;
};

export default Home;
