import Header from "components/Header";
import { useOrders } from "features/dashboard/hooks";
import { OrderItem } from "features/order/OrderItem";
import { Transaction } from "types/api";

const HistoryPage = () => {
    const { data: orders } = useOrders();
    const fakeOrders: Transaction[] = [
        {
            id: 1,
            symbol: "BTC",
            amount: 30000,
            units: 2,
            userId: 3,
            createdAt: new Date().toISOString(),
        },
        {
            id: 2,
            symbol: "ETH",
            amount: 10000,
            units: 1,
            userId: 2,
            createdAt: new Date().toISOString(),
        },
    ];

    return (
        <>
            <Header />
            <main className="container mx-auto lg:max-w-[95ch]">
                <div className="flex space-x-3 items-center mt-6">
                    <a
                        className="back hover:scale-110 hover:-translate-x-1 transition-all cursor-pointer"
                        data-js="back"
                        href="/"
                    >
                        <i className="gg-arrow-left"></i>
                    </a>
                    <h1 className="text-2xl">Order History</h1>
                </div>

                <div className="grid grid-cols-5 text-radix-slate11 px-4 py-3 text-sm bg-radix-slate3 mt-12">
                    <span className="border-r px-3 slate-border">Type</span>
                    <span className="border-r px-3 slate-border">Amount</span>
                    <span className="border-r px-3 slate-border">Price</span>
                    <span className="border-r px-3 slate-border">
                        Created at
                    </span>
                    <span className="px-3 slate-border"></span>
                </div>
                <ul className="slate-border border" data-js="order-list">
                    <li className="px-4 py-3 border-b slate-border hover:bg-radix-slate2 last:border-none grid grid-cols-5">
                        <div className="flex items-center space-x-2 text-radix-slate11 font-medium">
                            <span className="h-full w-1 block bg-radix-green9"></span>
                            <span>BUY</span>
                        </div>
                    </li>

                    {fakeOrders?.map((order) => (
                        <OrderItem order={order} />
                    ))}
                    <li className="px-4 py-3 border-b slate-border last:border-none grid grid-cols-4">
                        <div className="flex items-center space-x-2 text-radix-slate11 font-medium">
                            <span className="h-full w-1 block bg-radix-red9"></span>
                            <span>SELL</span>
                        </div>
                    </li>
                </ul>
            </main>
        </>
    );
};

export default HistoryPage;
