import Header from "components/Header";
import { useAuth } from "features/auth/AuthProvider";
import { Outlet, Navigate } from "react-router-dom";
import { CgMenu, CgSpinner } from "react-icons/cg";
import { Button } from "components";

const DashboardLayout = () => {
    const { user, loading } = useAuth();

    if (loading)
        return (
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-radix-blue9">
                <CgSpinner className="animate-spin" size="6rem" />
            </div>
        );

    if (!user) return <Navigate to="/login" />;
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
};

export default DashboardLayout;
