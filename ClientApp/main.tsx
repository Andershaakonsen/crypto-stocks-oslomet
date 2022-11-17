import "./src/style.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import HomePage from "pages/HomePage";
import { SWRConfig } from "swr";
import { ofetch } from "ofetch";

import DashboardPage from "features/dashboard/DashboardPage";

const router = createBrowserRouter(
    createRoutesFromElements(<Route path="/" element={<DashboardPage />} />)
);

// Create a global fetcher for SWR using ofetch library (modified fetch wrapper)
const fetcher = (url: string) => ofetch(url);

const Main = () => (
    <React.StrictMode>
        <SWRConfig value={{ fetcher }}>
            <RouterProvider router={router} />
        </SWRConfig>
    </React.StrictMode>
);

// React 18 Concurrent Mode
const appRoot = document.getElementById("app")!;
const root = createRoot(appRoot);
root.render(<Main />);
