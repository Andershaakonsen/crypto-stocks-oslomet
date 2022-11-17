// import { useStocks } from "./hooks";

import Header from "components/Header";
import CoinDisplay from "./CoinDisplay";
import OrderHistory from "./OrderHistory";
import Sidebar from "./Sidebar";

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
