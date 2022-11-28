import { Transaction } from "types/api";

interface OrderItemProps {
    order: Transaction;
}
// Add OrderItem here!
export const OrderItem = ({
    order: { id, symbol, amount, units, userId, createdAt },
}: OrderItemProps) => {
    const formatUSD = (amount: any) => {
        return amount;
    };
    //bottom of li
    // <div>${children}</div>
    return (
        <li className="px-4 py-3 border-b slate-border last:border-none grid grid-cols-5 w-full">
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
            <div>
                <span className="text-radix-slate11 font-medium">
                    {createdAt}
                </span>
            </div>
        </li>
    );
};
