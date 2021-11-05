import Sound from "react-sound";
import React, { SyntheticEvent } from "react";
import { ProvingProcess } from "@metaplex/js";

export default function SoundController() {
    const [isMusicPlaying, setIsMusicPlaying] = React.useState(false);
    const [isLabelVisible, setIsLabelVisible] = React.useState(false);

    const toggleMusic = (e: SyntheticEvent) => {
        setIsMusicPlaying(!isMusicPlaying);
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    const showLabel = () => {
        setIsLabelVisible(true);
    };

    const hideLabel = () => {
        setIsLabelVisible(false);
    };

    return (
        <>
            <div
                onMouseEnter={showLabel}
                onMouseLeave={hideLabel}
                className="absolute z-50 flex flex-row justify-center text-gray-300 left-2 bottom-2"
            >
                <button
                    onClick={toggleMusic}
                    className="text-gray-300 cursor-pointer "
                >
                    {isMusicPlaying ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                    )}
                </button>
                <span
                    hidden={!isLabelVisible}
                    className="ml-2 text-sm text-gray-300 font-cool"
                >
                    Waves by
                    <a
                        href="mailto:intratekmusic@outlook.com"
                        className="ml-1 underline"
                    >
                        lukepcfx
                    </a>
                </span>
            </div>
            <Sound
                url={"assets/audio/desolates.mp3"}
                playStatus={
                    // @ts-ignore
                    isMusicPlaying ? Sound.status.PLAYING : Sound.status.PAUSED
                }
                autoLoad={true}
                loop={true}
                volume={30}
                // @ts-ignore
                onPlaying={(soundPlayer) => {
                    // Don't ask why... but without this the audio doesn't loop  ¯\_(ツ)_/¯
                    if (soundPlayer.instanceCount == 0) {
                        soundPlayer.instanceCount++;
                    }
                }}
            />
        </>
    );
}
