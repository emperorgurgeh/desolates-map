import Link from "next/link";
import Planet from "../../core/modules/Planet";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import {
    preventEventPropagation,
    shortenAddress,
} from "../../utils/displayUtils";

interface Props {
    selectedPlanet: Planet;
    loadingOwner: boolean;
    ownerAddress: string | null;
}

interface User {
    displayName: string | null;
    discordId: string | number | null;
    githubUsername: string | null;
    twitterUsername: string | null;
}

/*
  Possible states:
  - loading solana address: LOADING_SOL_ADDR
    - (address found):
      - loading user data from firestore: LOADING_DB_USER
        - user data found: LOADED_DB_USER_EXISTS
        - user data not found: LOADED_DB_USER_NOT_EXISTS
    - address not found: LOADED_SOL_ADDR_UNCLAIMED
*/
enum LoadingStage {
    LOADING_SOL_ADDR,
    LOADING_DB_USER,
    LOADED_DB_USER_EXISTS,
    LOADED_DB_USER_NOT_EXISTS,
    LOADED_SOL_ADDR_UNCLAIMED,
}

export default function OwnerProfileChip(props: Props): JSX.Element {
    const { loadingOwner, ownerAddress } = props;

    let user: User | undefined, userDbLoading, userDbError;
    if (ownerAddress) {
        [user, userDbLoading, userDbError] = useDocumentDataOnce(
            doc(db, "users", ownerAddress)
        );

        if (userDbError) {
            console.warn(userDbError);
        }
    }

    let stage = determineStage(loadingOwner, ownerAddress, user, userDbLoading);

    let ownerLabel = "";
    let ownerAddressShort = ownerAddress ? shortenAddress(ownerAddress) : "";
    let ownerAddressUri;
    let ownerDiscordUri;
    let ownerTwitterUri;
    let ownerGithubUri;
    switch (stage) {
        case LoadingStage.LOADING_SOL_ADDR:
            ownerLabel = "Loading";
            ownerAddressUri = undefined;
            ownerDiscordUri = undefined;
            ownerTwitterUri = undefined;
            ownerGithubUri = undefined;
            break;
        case LoadingStage.LOADING_DB_USER:
            ownerLabel = ownerAddressShort;
            ownerAddressUri = `https://explorer.solana.com/address/${ownerAddress}`;
            ownerDiscordUri = undefined;
            ownerTwitterUri = undefined;
            ownerGithubUri = undefined;
            break;
        case LoadingStage.LOADED_DB_USER_EXISTS:
            ownerLabel = user!.displayName
                ? user!.displayName
                : ownerAddressShort;
            ownerAddressUri = `https://explorer.solana.com/address/${ownerAddress}`;
            ownerDiscordUri = user?.discordId
                ? `https://discordapp.com/users/${user.discordId}`
                : undefined;
            ownerTwitterUri = user?.twitterUsername
                ? `https://twitter.com/${user.twitterUsername}`
                : undefined;
            ownerGithubUri = user?.githubUsername
                ? `https://github.com/${user.githubUsername}`
                : undefined;
            break;
        case LoadingStage.LOADED_DB_USER_NOT_EXISTS:
            ownerLabel = ownerAddressShort;
            ownerAddressUri = `https://explorer.solana.com/address/${ownerAddress}`;
            ownerDiscordUri = undefined;
            ownerTwitterUri = undefined;
            ownerGithubUri = undefined;
            break;
        case LoadingStage.LOADED_SOL_ADDR_UNCLAIMED:
            ownerLabel = "Unclaimed";
            ownerAddressUri = undefined;
            ownerDiscordUri = undefined;
            ownerTwitterUri = undefined;
            ownerGithubUri = undefined;
            break;
    }

    return (
        <div>
            Owner: <span>{ownerLabel}</span>
            <div className="relative inline-block top-0.5 ml-2">
                {ownerAddressUri && (
                    <Link href={ownerAddressUri}>
                        <a
                            onClick={preventEventPropagation}
                            target="_blank"
                            className="inline-block w-4 h-4 ml-2"
                        >
                            {solanaIcon}
                        </a>
                    </Link>
                )}
                {ownerDiscordUri && (
                    <Link href={ownerDiscordUri}>
                        <a
                            onClick={preventEventPropagation}
                            target="_blank"
                            className="inline-block w-4 h-4 ml-2"
                        >
                            {discordIcon}
                        </a>
                    </Link>
                )}
                {ownerTwitterUri && (
                    <Link href={ownerTwitterUri}>
                        <a
                            onClick={preventEventPropagation}
                            target="_blank"
                            className="inline-block w-4 h-4 ml-2"
                        >
                            {twitterIcon}
                        </a>
                    </Link>
                )}
                {ownerGithubUri && (
                    <Link href={ownerGithubUri}>
                        <a
                            onClick={preventEventPropagation}
                            target="_blank"
                            className="inline-block w-4 h-4 ml-2"
                        >
                            {githubIcon}
                        </a>
                    </Link>
                )}
            </div>
        </div>
    );
}

/*
  Possible states:
  - loading solana address: LOADING_SOL_ADDR
    - (address found):
      - loading user data from firestore: LOADING_DB_USER
        - user data found: LOADED_DB_USER_EXISTS
        - user data not found: LOADED_DB_USER_NOT_EXISTS
    - address not found: LOADED_SOL_ADDR_UNCLAIMED
*/
function determineStage(
    loadingOwner: boolean,
    ownerAddress: string | null,
    user: User | undefined,
    userDbLoading: boolean | undefined
): LoadingStage {
    if (loadingOwner) {
        return LoadingStage.LOADING_SOL_ADDR;
    } else if (ownerAddress) {
        if (userDbLoading) {
            return LoadingStage.LOADING_DB_USER;
        } else if (user) {
            return LoadingStage.LOADED_DB_USER_EXISTS;
        } else {
            return LoadingStage.LOADED_DB_USER_NOT_EXISTS;
        }
    } else {
        return LoadingStage.LOADED_SOL_ADDR_UNCLAIMED;
    }
}

const solanaIcon = (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="200" cy="200" r="200" fill="white" />
        <g clipPath="url(#clip0)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M123.42 255.13C124.173 254.302 125.09 253.641 126.113 253.188C127.135 252.735 128.242 252.501 129.36 252.5L312.64 252.65C313.421 252.652 314.184 252.88 314.837 253.307C315.491 253.734 316.006 254.342 316.32 255.056C316.635 255.77 316.735 256.561 316.609 257.331C316.483 258.101 316.136 258.818 315.61 259.395L276.58 302.37C275.827 303.198 274.909 303.86 273.886 304.313C272.862 304.766 271.755 305 270.635 305L87.3602 304.85C86.5797 304.848 85.8164 304.62 85.1631 304.193C84.5098 303.766 83.9946 303.158 83.6801 302.444C83.3656 301.73 83.2652 300.939 83.3913 300.169C83.5173 299.399 83.8644 298.682 84.3902 298.105L123.42 255.13ZM315.61 219.355C316.136 219.932 316.483 220.649 316.609 221.419C316.735 222.189 316.635 222.98 316.32 223.694C316.006 224.408 315.491 225.016 314.837 225.443C314.184 225.87 313.421 226.098 312.64 226.1L129.365 226.25C128.246 226.25 127.139 226.016 126.115 225.563C125.091 225.11 124.173 224.448 123.42 223.62L84.3902 180.62C83.8644 180.043 83.5173 179.326 83.3913 178.556C83.2652 177.786 83.3656 176.995 83.6801 176.281C83.9946 175.567 84.5098 174.959 85.1631 174.532C85.8164 174.105 86.5797 173.877 87.3602 173.875L270.64 173.725C271.759 173.726 272.865 173.96 273.888 174.413C274.911 174.866 275.828 175.527 276.58 176.355L315.61 219.355ZM123.42 97.63C124.173 96.8023 125.09 96.1408 126.113 95.6879C127.135 95.2351 128.242 95.0007 129.36 95L312.64 95.15C313.421 95.1516 314.184 95.3798 314.837 95.8069C315.491 96.234 316.006 96.8416 316.32 97.5559C316.635 98.2703 316.735 99.0606 316.609 99.8308C316.483 100.601 316.136 101.318 315.61 101.895L276.58 144.87C275.827 145.698 274.909 146.36 273.886 146.813C272.862 147.266 271.755 147.5 270.635 147.5L87.3602 147.35C86.5797 147.348 85.8164 147.12 85.1631 146.693C84.5098 146.266 83.9946 145.658 83.6801 144.944C83.3656 144.23 83.2652 143.439 83.3913 142.669C83.5173 141.899 83.8644 141.182 84.3902 140.605L123.42 97.63Z"
                fill="url(#paint0_linear)"
            />
        </g>
        <defs>
            <linearGradient
                id="paint0_linear"
                x1="90.4202"
                y1="309.58"
                x2="309.58"
                y2="90.42"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#9945FF" />
                <stop offset="0.2" stopColor="#7962E7" />
                <stop offset="1" stopColor="#00D18C" />
            </linearGradient>
            <clipPath id="clip0">
                <rect
                    width="240"
                    height="210"
                    fill="white"
                    transform="translate(80 95)"
                />
            </clipPath>
        </defs>
    </svg>
);

const discordIcon = (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Discord</title>
        <circle cx="12" cy="12" r="12" fill="#5865F2" />
        <path
            transform="scale(0.8 0.8)
            translate(3 3)"
            fill="white"
            d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
        />
    </svg>
);

const twitterIcon = (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Twitter</title>
        <circle cx="12" cy="12" r="12" fill="#1DA1F2" />
        <path
            transform="scale(0.8 0.8)
            translate(3 3)"
            fill="white"
            d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
        />
    </svg>
);

const githubIcon = (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>GitHub</title>
        <circle cx="12" cy="12" r="12" fill="black" />
        <path
            fill="white"
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        />
    </svg>
);
