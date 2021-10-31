import { useContext, useEffect, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Clusters, SpaceRendererContext } from "../../pages/_app";

/* eslint-disable @next/next/no-img-element */
export default function ClusterSelection() {
    const { cluster, setCluster, changeCurrentCluster } =
        useContext(SpaceRendererContext);

    const [loadedImage, setLoadedImage] = useState(false);

    function handleOptionChange(e: any) {
        console.log(e.target.value);
        changeCurrentCluster(e.target.value, true);
    }

    function handleLoadedImage() {
        setLoadedImage(true);
    }

    return (
        <div
            id="cluster-info"
            className="z-10 px-3 pt-2 pb-3 mb-6 text-left transition-opacity duration-1000 ease-out rounded-lg opacity-100 text-primary font-cool w-80 backdrop-filter backdrop-blur outline-cool shadow-cool bg-faded"
        >
            <p className="mb-2 text-lg">Cluster map</p>
            <SwitchTransition>
                <CSSTransition key={cluster} timeout={200} classNames="fade">
                    <div className="min-h-[191px]">
                        <img
                            id="cluster-image"
                            className={`w-48 m-auto`}
                            src={`assets/sprites/${cluster}.png`}
                            alt={cluster}
                            onLoadedData={handleLoadedImage}
                        />
                    </div>
                </CSSTransition>
            </SwitchTransition>
            <select
                value={cluster}
                onChange={handleOptionChange}
                className="block w-auto mx-auto mt-4 bg-transparent outline-none cursor-pointer form-select"
            >
                <ClusterSelectionOption clusterName={Clusters.ALPHA} />
                <ClusterSelectionOption clusterName={Clusters.BETA} />
                <ClusterSelectionOption clusterName={Clusters.GAMMA} />
                <ClusterSelectionOption clusterName={Clusters.DELTA} />
                <ClusterSelectionOption clusterName={Clusters.EPSILON} />
                <ClusterSelectionOption clusterName={Clusters.ZETA} />
                <ClusterSelectionOption clusterName={Clusters.ETA} />
                <ClusterSelectionOption clusterName={Clusters.THETA} />
            </select>
        </div>
    );
}

function ClusterSelectionOption({ clusterName }: any) {
    const { cluster } = useContext(SpaceRendererContext);

    return (
        <option
            value={clusterName}
            selected={clusterName === cluster}
            disabled={clusterName === cluster}
            hidden={clusterName === cluster}
        >
            {clusterName.charAt(0).toUpperCase() + clusterName.slice(1)} cluster
        </option>
    );
}
