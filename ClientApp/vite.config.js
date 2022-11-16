import { swcReactRefresh } from "vite-plugin-swc-react-refresh";

/** @type {import('vite').UserConfig["build"]} */
const build = {
    outDir: "./dist",
};

/** @type {import('vite').UserConfig} */
export default {
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:5001",
                changeOrigin: true,
                secure: false,
            },
        },
        hmr: {
            protocol: "ws",
        },
    },
    build,
    esbuild: {
        jsx: "automatic",
    },
    plugins: [swcReactRefresh()],
};
