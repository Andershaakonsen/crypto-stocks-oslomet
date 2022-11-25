import "./style.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import { ofetch } from "ofetch";
import { Router } from "Routes";
import Header from "components/Header";
import AuthProvider from "features/auth/AuthProvider";

// Create a global fetcher for SWR using ofetch library (modified fetch wrapper)
const fetcher = (url: string) => ofetch(url);

const Main = () => (
    <React.StrictMode>
        <SWRConfig value={{ fetcher }}>
            <AuthProvider>
                <BrowserRouter>
                    <Router />
                </BrowserRouter>
            </AuthProvider>
        </SWRConfig>
    </React.StrictMode>
);

// React 18 Concurrent Mode
const appRoot = document.getElementById("app")!;
const root = createRoot(appRoot);
root.render(<Main />);
