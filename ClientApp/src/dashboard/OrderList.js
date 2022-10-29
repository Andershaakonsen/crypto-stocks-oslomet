import { formatUSD, getByDataJS } from "../utils";
import { getOrders } from "./dashboard.api";

export function OrderlistItem({ order, as = "li" }) {
    return /*html*/ `
    <${as}
        class="px-4 py-3 border-b slate-border last:border-none grid grid-cols-5 w-full"
    >
        <div
            class="flex items-center space-x-2 text-radix-slate11 font-medium"
        >
            <span class="h-full w-1 block bg-radix-green9"></span>
            <span class="uppercase">
                ${order.mode}
            </span>
            <span>
                $${order.symbol}
            </span>
        </div>

        <div>
            <span class="block text-radix-slate11 font-medium truncate">
                ${order.units}
            </span>
        </div>
        <div>
            <span class="text-radix-slate11 font-medium">
                ${formatUSD(order.amount)}
            </span>
        </div>
        <div>
            <span class="text-radix-slate11 font-medium">
                ${new Date(order.createdAt).toLocaleDateString("nb-NO", {
                    dateStyle: "long",
                })}
            </span>
        </div>
    </${as}>`;
}

const init = async () => {
    const orders = await getOrders();
    const orderList = getByDataJS("order-list");
    orderList.innerHTML = orders
        .map((order) => OrderlistItem({ order }))
        .join("");
};

const OrderList = {
    init,
};

export default OrderList;
