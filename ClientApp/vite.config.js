import { swcReactRefresh } from "vite-plugin-swc-react-refresh";
import mkcert from "vite-plugin-mkcert";

/** @type {import('vite').UserConfig["build"]} */
const build = {
    outDir: "./dist",
};

/** @type {import('vite').UserConfig} */
export default {
    server: {
        https: true,
        port: 3000,
        proxy: {
            "/api": {
                target: "https://localhost:5002",
                changeOrigin: true,
                secure: true,
            },
        },
    },
    build,
    esbuild: {
        jsx: "automatic",
    },
    plugins: [swcReactRefresh(), mkcert()],
};
