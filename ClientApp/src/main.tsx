import "./style.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import { FetchOptions, ofetch } from "ofetch";
import { Router } from "Routes";
import AuthProvider from "features/auth/AuthProvider";
import ThemeProvider from "features/auth/ThemeProvider";

// Create a global fetcher for SWR using ofetch library (modified fetch wrapper)
interface OfetchInit extends FetchOptions {
    url: string;
}
const fetcher = (url: string | OfetchInit | [string, FetchOptions]) => {
    const headers: HeadersInit = {};
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return (
        typeof url === "string"
            ? ofetch(url, { headers })
            : Array.isArray(url)
            ? ofetch(url[0], {
                  ...url[1],
                  headers: { ...url[1].headers, ...headers },
              })
            : ofetch(url.url, {
                  ...url,
                  headers: { ...headers, ...url.headers },
              })
    ).then((r) => r.data);
};

const Main = () => (
    <React.StrictMode>
        <SWRConfig value={{ fetcher }}>
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
