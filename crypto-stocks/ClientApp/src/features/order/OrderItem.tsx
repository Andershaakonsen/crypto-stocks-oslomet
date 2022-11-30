import { Transaction } from "types/api";
import { formatUSD } from "utils/format";

interface OrderItemProps {
    order: Transaction;
    children?: React.ReactNode;
}
// Add OrderItem here!
export const OrderItem = ({
    order: { symbol, amount, units, createdAt },
    children,
}: OrderItemProps) => {
    return (
        <li className="px-4 py-3 border-b slate-border last:border-none grid grid-cols-3 gap-y-2 lg:grid-cols-5 w-full">
            <div className="flex items-center space-x-2 text-radix-slate11 font-medium">
                <span className="h-full w-1 block bg-radix-green9"></span>
                <span className="uppercase">BUY</span>
                <span>{symbol}</span>
            </div>
            <div>
                <span className="block text-radix-slate11 font-medium truncate">
                    {units}
                </span>
            </div>
            <div>
                <span className="text-radix-slate11 font-medium">
                    {formatUSD(amount)}
                </span>
            </div>
            <div className="hidden lg:block">
                <span className="text-radix-slate11 font-medium">
                    {new Date(createdAt).toLocaleString("nb-NO")}
                </span>
            </div>
            <div className="col-span-3 lg:col-span-1 flex justify-center lg:block">
                {children}
            </div>
        </li>
    );
};
