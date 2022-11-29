// import { useStocks } from "./hooks";

import OrderHistory from "features/order/OrderHistory";
import CoinDisplay from "./CoinDisplay";
import Sidebar from "./sidebar/Sidebar";

const DashboardPage = () => {
    return (
        <div className="dashboard">
            <Sidebar />
            <aside className="right-sidebar"></aside>
            <CoinDisplay />
            <OrderHistory />
        </div>
    );
};

export default DashboardPage;
