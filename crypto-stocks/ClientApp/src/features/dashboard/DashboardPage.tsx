// import { useStocks } from "./hooks";

import { Button } from "components";
import OrderHistory from "features/order/OrderHistory";
import { CgMenu } from "react-icons/cg";
import CoinDisplay from "./CoinDisplay";
import Sidebar, { sidebarState, useSidebar } from "./sidebar/Sidebar";

const DashboardPage = () => {
    const open = useSidebar().open;
    return (
        <>
            <div className="h-10 sticky top-14 z-50 bg-radix-slate1 flex items-center px-4 border-b border-radix-slate6 lg:hidden">
                <Button
                    onClick={() => (sidebarState.open = !open)}
                    size="sm"
                    color="slate"
                >
                    <CgMenu />
                    <span>{open ? "Close" : "Order"}</span>
                </Button>
            </div>
            <div className="dashboard">
                <Sidebar />
                <aside className="right-sidebar"></aside>
                <CoinDisplay />
                <OrderHistory />
            </div>
        </>
    );
};

export default DashboardPage;
