import { swcReactRefresh } from "vite-plugin-swc-react-refresh";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";
import https from "node:https";

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
                agent: new https.Agent({
                    // Override the agent to allow self signed certificates in development mode
                    rejectUnauthorized: false,
                }),
            },
        },
    },
    build,
    esbuild: {
        jsx: "automatic",
    },
    plugins: [tsconfigPaths(), swcReactRefresh(), mkcert()],
};
