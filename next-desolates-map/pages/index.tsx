import type { NextPage } from "next";
import { useEffect, useState } from "react";
import SpaceRenderer from "../core/SpaceRenderer";

const Home: NextPage = (spaceRenderer) => {
    const { stage, config } = SpaceRenderer.getInstance();
    // const { stage, setStage, TEXTURE_SUFFIX, LOW_RES, SKYBOX_RADIUS } =
    //     useConfig();

    const [inputStage, setInputStage] = useState<number>(stage as any);

    return (
        <>
            {stage == stage.LOADING && (
                <div className="z-10 flex items-center justify-center w-1/2 bg-red-400 h-1/2">
                    <input
                        type="number"
                        min={stage[0]}
                        max={Object.keys(stage).length}
                        value={inputStage}
                        onChange={(e) => {
                            setInputStage(parseInt(e.target.value));
                        }}
                    />
                    <button
                        onClick={() => {
                            config.changeStage(inputStage);
                        }}
                    >
                        Set Stage {inputStage}
                    </button>
                </div>
            )}
            {stage == stage.CLUSTER_SELECTION && (
                <div className="z-10 flex items-center bg-red-400 justify-centerw-1/2 h-1/2">
                    <p>CLUSTER SELECTION</p>
                </div>
            )}
            {stage == stage.CLUSTER_TRANSITION && (
                <div className="z-10 flex items-center bg-red-400 justify-centerw-1/2 h-1/2">
                    <p>CLUSTER TRANSITION</p>
                </div>
            )}
            {stage == stage.SPACE_NAVIGATION && (
                <div className="z-10 flex items-center bg-red-400 justify-centerw-1/2 h-1/2">
                    <p>SPACE NAVIGATION</p>
                </div>
            )}
        </>
    );
    return null;
};

export default Home;
