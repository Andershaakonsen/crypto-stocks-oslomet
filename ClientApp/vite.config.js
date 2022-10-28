/** @type {import('vite').UserConfig["build"]} */
const build = {
    rollupOptions: {
        input: {
            main: new URL("./index.html", import.meta.url).href,
            login: new URL("./login/index.html", import.meta.url).href,
        },
    },
    outDir: "../wwwroot",
};

/** @type {import('vite').UserConfig} */
export default {
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://0.0.0.0:5001",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => {
                    return path.replace(/^\/api/, "");
                },
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
