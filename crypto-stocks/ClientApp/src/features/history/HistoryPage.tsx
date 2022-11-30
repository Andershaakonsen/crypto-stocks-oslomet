import Header from "components/Header";
import { useOrders } from "features/dashboard/hooks";
import OrderActions from "features/order/OrderActions";
import { OrderItem } from "features/order/OrderItem";

const HistoryPage = () => {
    const { data: orders } = useOrders(100);
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
                    {orders?.map((order) => (
                        <OrderItem key={order.id} order={order}>
                            <OrderActions orderId={order.id} />
                        </OrderItem>
                    ))}
                </ul>
            </main>
        </>
    );
};

export default HistoryPage;
