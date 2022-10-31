import { resolve } from "path";

/** @type {import('vite').UserConfig["build"]} */
const build = {
    rollupOptions: {
        input: {
            // main: new URL("./index.html", import.meta.url).href,
            // history: new URL("./history/index.html", import.meta.url).href,
            main: resolve(__dirname, "index.html"),
            history: resolve(__dirname, "history/index.html"),
        },
    },
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
    plugins: [useForwardTrailing(Object.keys(build.rollupOptions.input))],
};

// Forward trailing slash - Vite error
// https://github.com/vitejs/vite/issues/6596#issuecomment-1114363584
function useForwardTrailing(routes) {
    return {
        name: "forward-to-trailing-slash",
        configureServer(server) {
            server.middlewares.use((req, _res, next) => {
                const requestURLwithoutLeadingSlash = req.url.substring(1);

                if (
                    Object.values(routes).includes(
                        requestURLwithoutLeadingSlash
                    )
                ) {
                    req.url = `${req.url}/`;
                }
                next();
            });
        },
    };
}
