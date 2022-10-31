import { formatUSD, getByDataJS } from "../utils";
import { getOrders } from "../api";
import { orderListState } from "../state";

// children is the order-actions WebComponent if provided. This item is reused in /history without the order-actions
// "as" property to decide what the element should be rendered as. /history renders as div
export function OrderlistItem({ order, as = "li", children = "" }) {
    return /*html*/ `
    <${as}
        class="px-4 py-3 border-b slate-border last:border-none grid grid-cols-5 w-full"
    >
        <div
            class="flex items-center space-x-2 text-radix-slate11 font-medium"
        >
            <span class="h-full w-1 block bg-radix-green9"></span>
            <span class="uppercase">
                BUY
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
        <div>
            ${children}
        </div>
    </${as}>`;
}

const init = async () => {
    const orders = await getOrders({ limit: 100 });
    orderListState.set(orders);

    /**
     * Render the order list.
     */
    const orderList = getByDataJS("order-list");
    orderListState.subscribe((orders) => {
        // Subscription is handled inside Init to avoid subscribing on /history
        orderList.innerHTML = orders
            .map((order) =>
                OrderlistItem({
                    order,
                    children: /*html*/ `<order-actions data-order-id="${order.id}"></order-actions>`, // Render the order actions (WebComponent)
                })
            )
            .join("");

        // Add event listener
    });
};

const mutate = async () => {
    const orders = await getOrders({ limit: 100 });
    orderListState.set(orders);
};

const OrderList = {
    init,
    mutate,
};

export default OrderList;
