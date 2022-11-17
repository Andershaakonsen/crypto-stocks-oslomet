import "./style.scss";
import React from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
    Route,
    Link,
} from "react-router-dom";
import { SWRConfig } from "swr";
import { ofetch } from "ofetch";
import DashboardPage from "features/dashboard/DashboardPage";
import UIPreview from "components/design-system";
import { Button } from "components";

const Error = () => (
    <div className="h-screen w-full text-radix-red11 grid place-items-center">
        <div className="text-center">
            <span>Something went wrong</span>
            <Button className="mt-4" color="red" as={Link} to={"/"}>
                <span>Try again</span>
            </Button>
        </div>
    </div>
);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route errorElement={<Error />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="design" element={<UIPreview />} />
            <Route path="*" element={<div>404</div>} />
        </Route>
    )
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
