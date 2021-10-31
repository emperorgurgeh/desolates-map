import { useContext, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { SpaceRendererContext } from "../../pages/_app";
import Loader from "../Loader/Loader";

const PER_PAGE = 3;

export default function Inhabitants() {
    const { selectedPlanet } = useContext(SpaceRendererContext);
    const [page, setPage] = useState(1);

    const [nfts, setNFTs] = useState([]);
    const [maxPages, setMaxPages] = useState<number>(-1);

    const [loading, setLoading] = useState(true);

    async function fetchNFTs() {
        setLoading(true);
        const res = await fetch(
            `/api/allNFTsForOwner/${selectedPlanet?.ownerAddress}?perPage=${PER_PAGE}&page=${page}&includeTotal=1`
        );

        if (res.status === 200) {
            const resData = await res.json();

            setMaxPages(Math.ceil(resData.totalCount / PER_PAGE));
            setLoading(false);
            setNFTs(nfts.concat(resData.nfts));
        }
    }

    useEffect(() => {
        fetchNFTs();
        console.log(selectedPlanet);
    }, []);

    useEffect(() => {
        if (page < maxPages) {
            fetchNFTs();
        }
    }, [page]);

    return (
        <div className="z-10 flex flex-col items-center px-3 pt-2 pb-3 text-left rounded-lg opacity-100 text-primary font-cool w-80 backdrop-filter backdrop-blur outline-cool shadow-cool bg-faded">
            <p className="self-start mb-2 text-lg">Inhabitants</p>

            <div className="flex flex-col">
                {nfts.map((nft: any) => {
                    return (
                        <AnNFT
                            key={nft.name}
                            image={nft.image}
                            name={nft.name}
                        />
                    );
                })}
            </div>

            <CSSTransition
                in={loading}
                timeout={100}
                classNames="fade"
                unmountOnExit
            >
                <Loader color="border-[#1BFFF1E6]" className="my-4" />
            </CSSTransition>

            {page < maxPages && (
                <button
                    onClick={() => setPage(page + 1)}
                    className="p-2 text-sm text-center transition-colors duration-200 rounded-lg w-36 hover:text-white hover:bg-primary outline-cool backdrop-filter backdrop-blur bg-faded"
                >
                    LOAD MORE
                </button>
            )}
        </div>
    );
}

function AnNFT({ image, name }: any) {
    return (
        <div className="relative flex w-full mb-4 overflow-hidden rounded-lg">
            <img src={image} />

            <p className="absolute text-xs px-0.5 bg-black text-primary top-2 left-2">
                {name}
            </p>
        </div>
    );
}
