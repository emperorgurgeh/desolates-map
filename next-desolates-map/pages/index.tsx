import type { NextPage } from "next";
import { useContext } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import ClusterSelection from "../components/ClusterSelectionView/ClusterSelection";
import Loader from "../components/Loader/Loader";
import SpaceNavigation from "../components/SpaceNavigationView/SpaceNavigation";
import SoundController from "../components/SoundController/SoundController";
import Head from 'next/head'

import { SpaceRendererContext, Stages } from "./_app";

const Home: NextPage = (spaceRenderer) => {
    const { stage } = useContext(SpaceRendererContext);

    return (
        <>
            <Head>
                <title>DESOLATEs Map</title>
                <meta name="description" content="3D map of all the planets in the DESOLATEs metaverse" />
            </Head>
            <h1
                className="absolute z-10 text-3xl tracking-tighter text-white select-none top-6 backdrop-blur backdrop-filter font-nasalization"
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
            <SoundController />
        </>
    );
};

export default Home;
