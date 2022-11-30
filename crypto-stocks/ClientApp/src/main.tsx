import "./style.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import { Router } from "Routes";
import AuthProvider from "features/auth/AuthProvider";
import ThemeProvider from "features/auth/ThemeProvider";
import { swrFetcher } from "utils/fetch";

const Main = () => (
    <React.StrictMode>
        <SWRConfig value={{ fetcher: swrFetcher }}>
            <AuthProvider>
                <ThemeProvider>
                    <BrowserRouter>
                        <Router />
                    </BrowserRouter>
                </ThemeProvider>
            </AuthProvider>
        </SWRConfig>
    </React.StrictMode>
);

// React 18 Concurrent Mode
const appRoot = document.getElementById("app")!;
const root = createRoot(appRoot);
root.render(<Main />);
