import { useContext, useState } from "react";
import CameraMovement from "../../core/modules/CameraMovement";
import { Clusters, SpaceRendererContext, Stages } from "../../pages/_app";
import { searchForPlanetAndChangeStage } from "../RenderController/RenderController";
import Image from "next/image";
import pic from "../../public/profile.png";

export default function SettingsPage() {
    function handleKeyDown() {}

    return (
        // Global window
        <div className="fixed top-7 right-0 left-0 flex mt-10 lg:absolute lg:flex lg:justify-center">
            <div className="fixed ml-5 mr-5 rounded-lg backdrop-filter backdrop-blur outline-cool shadow-cool bg-faded max-w-[1100px] absolute top-0 right-0 flex flex-col max-h-180 p-2 overflow-y-auto select-none no-scrollbar lg:relative lg:max-w-[900px] lg:top-0 lg:flex lg:flex-col lg:py-0 lg:mt-5 lg:overflow-hidden lg:h-max">
                <div className="pb-1 flex items-center lg:pt-0 lg:pb-0">
                    <div className="flex-1 max-w-4x1 mx-auto p-2 lg:p-6">
                        {/* Section 1 - header */}

                        <section>
                            <div className="hidden lg:flex lg:justify-between">
                                <p className="text-lg font-cool text-primary">Profile</p>
                                <p className="text-lg font-cool text-primary">Owner</p>
                            </div>
                            <div className="hidden lg:flex lg:justify-end">
                                <p className="text-lg font-cool text-primary">1453..3178</p>
                            </div>
                        </section>

                        {/* Section 1 - body */}

                        <ul className="max-h-screen justify-around lg:flex lg:justify-start">
                            <div className="lg:flex lg:basis-1/4 lg:items-center">
                                {/* Profile picture */}
                                <li className="">
                                    <div className="flex justify-center pt-2 pb-2 lg:flex lg:basis-1/8 lg:mr-10 lg:w-32">
                                        <Image src={pic} alt="Picture of the author" />
                                    </div>
                                </li>
                            </div>

                            <div className="lg:flex lg:basis-3/8 lg:flex-col">
                                {/* Twitter ID */}
                                <li className="">
                                    <div className="min-h-0 h-8 flex items-center lg:flex lg:basis-1/4">
                                        <p className="text-lg font-cool text-primary">Twitter</p>
                                    </div>
                                </li>

                                {/* Twitter Input */}
                                <li className="">
                                    <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1 lg:flex lg:basis-2/4 ">
                                        <input
                                            id="search-input"
                                            type="text"
                                            name="planet-no"
                                            size={40}
                                            className="w-full py-1 pl-3 lg:pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                            placeholder="@your_twitter"
                                            value="@desolateNFT"
                                            autoComplete="off"
                                            onKeyDown={handleKeyDown}
                                        ></input>
                                    </div>
                                </li>

                                {/* Discord ID */}
                                <li className="">
                                    <div className="min-h-0 h-8 flex items-center">
                                        <p className="text-lg font-cool text-primary">Discord</p>
                                    </div>
                                </li>

                                {/* Discord Input */}
                                <li className="">
                                    <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1">
                                        <input
                                            id="search-input"
                                            type="text"
                                            name="planet-no"
                                            size={40}
                                            className="w-full py-1 pl-3 lg:pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                            placeholder="@your_discord"
                                            value="Starship-AI#5817"
                                            autoComplete="off"
                                            onKeyDown={handleKeyDown}
                                        ></input>
                                    </div>
                                </li>

                                {/* Github ID */}
                                <li className="">
                                    <div className="min-h-0 h-8 flex items-center">
                                        <p className="text-lg font-cool text-primary">Github</p>
                                    </div>
                                </li>

                                {/* Github Input */}
                                <li className="">
                                    <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1">
                                        <input
                                            id="search-input"
                                            type="text"
                                            name="planet-no"
                                            size={40}
                                            className="w-full py-1 pl-3 lg:pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                            placeholder="@your_github"
                                            value="@emperorGurgeh"
                                            autoComplete="off"
                                            onKeyDown={handleKeyDown}
                                        ></input>
                                    </div>
                                </li>
                            </div>
                        </ul>

                        <hr className="w-full h-px m-auto mt-6 mb-6 border-none bg-faded" />

                        {/* Section 2 */}

                        <div className="h-8 mb-3">
                            <p className="text-lg font-cool text-primary">My Planets</p>
                        </div>

                        {/* Row 1 */}

                        <ul className="max-h-screen lg:flex justify-around lg:mb-5">
                            {/* Planet ID */}
                            <li className="">
                                <div className="min-h-0 h-8 flex items-center">
                                    <p className="text-lg font-cool text-primary">123</p>
                                </div>
                            </li>

                            {/* Planet Input */}
                            <li className="">
                                <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1">
                                    <input
                                        id="search-input"
                                        type="text"
                                        name="planet-no"
                                        size={40}
                                        className="w-full py-1 pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                        placeholder="Enter planet name..."
                                        autoComplete="off"
                                        onKeyDown={handleKeyDown}
                                    ></input>
                                </div>
                            </li>

                            {/* Planet ID */}
                            <li className="">
                                <div className="min-h-0 lg:ml-10 h-8 flex items-center">
                                    <p className="text-lg font-cool text-primary">123</p>
                                </div>
                            </li>

                            {/* Planet Input */}
                            <li className="">
                                <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1">
                                    <input
                                        id="search-input"
                                        type="text"
                                        name="planet-no"
                                        size={40}
                                        className="w-full py-1 pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                        placeholder="Enter planet name..."
                                        autoComplete="off"
                                        onKeyDown={handleKeyDown}
                                    ></input>
                                </div>
                            </li>
                        </ul>

                        {/* Row 2 */}

                        <ul className="max-h-screen lg:flex justify-around lg:mb-5">
                            {/* Planet ID */}
                            <li className="">
                                <div className="min-h-0 h-8flex items-center">
                                    <p className="text-lg font-cool text-primary">123</p>
                                </div>
                            </li>

                            {/* Planet Input */}
                            <li className="">
                                <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1">
                                    <input
                                        id="search-input"
                                        type="text"
                                        name="planet-no"
                                        size={40}
                                        className="w-full py-1 pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                        placeholder="Enter planet name..."
                                        autoComplete="off"
                                        onKeyDown={handleKeyDown}
                                    ></input>
                                </div>
                            </li>

                            {/* Planet ID */}
                            <li className="">
                                <div className="min-h-0 lg:ml-10 h-8 flex items-center">
                                    <p className="text-lg font-cool text-primary">123</p>
                                </div>
                            </li>

                            {/* Planet Input */}
                            <li className="">
                                <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1">
                                    <input
                                        id="search-input"
                                        type="text"
                                        name="planet-no"
                                        size={40}
                                        className="w-full py-1 pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                        placeholder="Enter planet name..."
                                        autoComplete="off"
                                        onKeyDown={handleKeyDown}
                                    ></input>
                                </div>
                            </li>
                        </ul>

                        {/* Row 3 */}

                        <ul className="max-h-screen lg:flex justify-around lg:mb-5">
                            {/* Planet ID */}
                            <li className="">
                                <div className="min-h-0 h-8 flex items-center">
                                    <p className="text-lg font-cool text-primary">123</p>
                                </div>
                            </li>

                            {/* Planet Input */}
                            <li className="">
                                <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1">
                                    <input
                                        id="search-input"
                                        type="text"
                                        name="planet-no"
                                        size={40}
                                        className="w-full py-1 pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                        placeholder="Enter planet name..."
                                        autoComplete="off"
                                        onKeyDown={handleKeyDown}
                                    ></input>
                                </div>
                            </li>

                            {/* Planet ID */}
                            <li className="">
                                <div className="min-h-0 lg:ml-10 h-8 flex items-center">
                                    <p className="text-lg font-cool text-primary">123</p>
                                </div>
                            </li>

                            {/* Planet Input */}
                            <li className="">
                                <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1">
                                    <input
                                        id="search-input"
                                        type="text"
                                        name="planet-no"
                                        size={40}
                                        className="w-full py-1 pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                        placeholder="Enter planet name..."
                                        autoComplete="off"
                                        onKeyDown={handleKeyDown}
                                    ></input>
                                </div>
                            </li>
                        </ul>

                        {/* Row 4 */}

                        <ul className="max-h-screen lg:flex justify-around lg:mb-5">
                            {/* Planet ID */}
                            <li className="">
                                <div className="min-h-0 h-8 flex items-center">
                                    <p className="text-lg font-cool text-primary">123</p>
                                </div>
                            </li>

                            {/* Planet Input */}
                            <li className="">
                                <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1">
                                    <input
                                        id="search-input"
                                        type="text"
                                        name="planet-no"
                                        size={40}
                                        className="w-full py-1 pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                        placeholder="Enter planet name..."
                                        autoComplete="off"
                                        onKeyDown={handleKeyDown}
                                    ></input>
                                </div>
                            </li>

                            {/* Planet ID */}
                            <li className="">
                                <div className="min-h-0 lg:ml-10 h-8 flex items-center">
                                    <p className="text-lg font-cool text-primary">123</p>
                                </div>
                            </li>

                            {/* Planet Input */}
                            <li className="">
                                <div className="min-h-0 lg:ml-3 h-8 w-full bg-black bg-opacity-75 rounded-lg outline-cool mb-5 lg:mb-1">
                                    <input
                                        id="search-input"
                                        type="text"
                                        name="planet-no"
                                        size={40}
                                        className="w-full py-1 pl-4 text-lg text-left bg-transparent rounded-r-lg text-primary font-cool placeholder-primary focus:outline-none"
                                        placeholder="Enter planet name..."
                                        autoComplete="off"
                                        onKeyDown={handleKeyDown}
                                    ></input>
                                </div>
                            </li>
                        </ul>

                        {/* Cancel & Save btns */}

                        <div className="min-h-0 max-h-screen  h-8 flex justify-end">
                            <button className="font-cool p-2 mr-3 text-sm text-center text-primary transition-colors duration-200 rounded-lg hover:text-white hover:bg-primary w-20 outline-cool backdrop-filter backdrop-blur bg-faded">
                                CANCEL
                            </button>

                            <button className="font-cool p-2 text-sm text-center text-primary transition-colors duration-200 rounded-lg hover:text-white hover:bg-primary w-20 outline-cool backdrop-filter backdrop-blur bg-faded">
                                SAVE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}