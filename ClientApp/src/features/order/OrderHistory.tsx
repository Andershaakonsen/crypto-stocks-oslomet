import { Button } from "components";
import { Transaction } from "types/api";
import { useOrders } from "../dashboard/hooks";
import { OrderItem } from "./OrderItem";

interface Props {}

const OrderHistory = ({}: Props) => {
    const { data: orders } = useOrders(3);
    const fakeOrders: Transaction[] = [
        {
            id: 1,
            symbol: "BTC",
            amount: 30000,
            units: 2,
            userId: 3,
            createdAt: new Date().toString(),
        },
        {
            id: 2,
            symbol: "ETH",
            amount: 10000,
            units: 1,
            userId: 2,
            createdAt: new Date().toString(),
        },
    ];

    return (
        <footer className="overflow-y-auto">
            <div className="flex items-center border-b slate-border bg-radix-slate3 h-12 px-4 justify-between ">
                <p className="title !text-base">Order History</p>
                <Button as="a" href="/history" size="sm">
                    <i className="gg-external mr-2"></i>View All
                </Button>
            </div>
            <div className="grid grid-cols-5 text-radix-slate11 px-4 py-1 text-sm bg-radix-slate3 sticky top-0 z-10">
                <span className="border-r px-3 slate-border">Type</span>
                <span className="border-r px-3 slate-border">Amount</span>
                <span className="border-r px-3 slate-border">Price</span>
                <span className="border-r px-3 slate-border">Created at</span>
                <span className="px-3 slate-border"></span>
            </div>
            <ul>
                {orders?.map((order) => (
                    <OrderItem key={order.id} order={order} />
                ))}
                <li className="text-center text-radix-slate11">
                    No orders made yet.
                </li>
            </ul>
        </footer>
    );
};

export default OrderHistory;
