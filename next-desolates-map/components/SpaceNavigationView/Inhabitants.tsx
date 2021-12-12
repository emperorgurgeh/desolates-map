import { useContext, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { SpaceRendererContext } from "../../pages/_app";
import API from "../../utils/API";
import Loader from "../Loader/Loader";

const PER_PAGE = 5;

export default function Inhabitants() {
    const { selectedPlanet } = useContext(SpaceRendererContext);
    const [page, setPage] = useState(1);

    const [nfts, setNFTs] = useState([]);
    const [maxPages, setMaxPages] = useState<number>(-1);

    const [loading, setLoading] = useState(true);

    const [mounted, setMounted] = useState(true);

    async function fetchNFTs() {
        setLoading(true);

        if (!selectedPlanet) {
            console.warn("Attempted to fetch NFTs with no planet selected");
            setLoading(false);
            return;
        }

        const res = await fetch(
            API.getPlanetNFTs(selectedPlanet.id, PER_PAGE, page)
        );

        if (mounted) {
            if (res.status === 200) {
                const resData = await res.json();

                setMaxPages(Math.ceil(resData.totalCount / PER_PAGE));
                setLoading(false);
                setNFTs(nfts.concat(resData.nfts));
            }
        }
    }

    useEffect(() => {
        fetchNFTs();
        return () => {
            setMounted(false);
        };
    }, []);

    useEffect(() => {
        if (page < maxPages) {
            fetchNFTs();
        }
    }, [page]);

    return (
        <div className="z-10 flex flex-col items-center px-3 pt-2 pb-3 text-left rounded-lg opacity-100 text-primary font-cool w-80 backdrop-filter backdrop-blur outline-cool shadow-cool bg-faded">
            <p className="self-start mb-2 text-lg">Inhabitants</p>

            <div className="flex flex-col justify-center">
                {nfts.map((nft: any) => {
                    return (
                        <AnNFT
                            key={nft.mint_hash}
                            image={nft.image}
                            imageMimetype={nft.image_mimetype}
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

function AnNFT({ image, name, imageMimetype }: any) {
    const isGif =
        image && (image.endsWith("ext=gif") || imageMimetype === "image/gif");
    const imageUrl = isGif
        ? API.getImage(image, 200, 200)
        : API.getImage(image, 500, 500);

    return (
        <div className="relative mb-2 overflow-hidden rounded-lg w-fit">
            <img className="m-auto" src={imageUrl} />

            <p className="absolute text-xs px-0.5 bg-black text-primary top-2 left-2">
                {name}
            </p>
        </div>
    );
}
