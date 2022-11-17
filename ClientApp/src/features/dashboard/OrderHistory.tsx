import { Button } from "components";

interface Props {}

const OrderHistory = ({}: Props) => {
    return (
        <footer className="overflow-y-auto">
            <div className="flex items-center border-b slate-border bg-radix-slate3 h-12 px-4 justify-between ">
                <p className="title !text-base">Order History</p>
                <Button size="sm">
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
                <li className="text-center text-radix-slate11">
                    No orders made yet.
                </li>
            </ul>
        </footer>
    );
};

export default OrderHistory;
