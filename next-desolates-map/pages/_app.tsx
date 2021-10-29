import "../styles/globals.css";
import type { AppProps } from "next/app";

import RenderController from "../components/RenderController/RenderController";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="relative flex items-center justify-center w-full h-screen max-h-screen min-h-screen">
            <RenderController />
            <Component {...pageProps} />
        </div>
    );
}
export default MyApp;
