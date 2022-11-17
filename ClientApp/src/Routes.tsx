import { Button } from "components";
import UIPreview from "components/design-system";
import DashboardPage from "features/dashboard/DashboardPage";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Link,
    Route,
} from "react-router-dom";

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

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route errorElement={<Error />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="design" element={<UIPreview />} />
            <Route path="*" element={<div>404</div>} />
        </Route>
    )
);
