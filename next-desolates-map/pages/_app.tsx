import "../styles/globals.css";
import type { AppProps } from "next/app";
import SpaceRenderer from "../components/SpaceRenderer/SpaceRenderer";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="flex w-full h-screen max-h-screen min-h-screen">
            <SpaceRenderer />
            <Component {...pageProps} />
        </div>
    );
}
export default MyApp;
