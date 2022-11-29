import { Button } from "components";
import UIPreview from "components/design-system";
import LoginPage from "features/auth/LoginPage";
import DashboardLayout from "features/dashboard/DashboardLayout";
import DashboardPage from "features/dashboard/DashboardPage";
import HistoryPage from "features/history/HistoryPage";
import { Link, Route, Routes } from "react-router-dom";

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

export const Router = () => {
    return (
        <Routes>
            <Route errorElement={<Error />}>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<DashboardPage />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="design" element={<UIPreview />} />
                <Route path="*" element={<div>404</div>} />
                <Route path="/history" element={<HistoryPage />} />
            </Route>
        </Routes>
    );
};
