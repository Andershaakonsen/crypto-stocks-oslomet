import { getOrders } from "../src/api";
import { OrderlistItem } from "../src/Order";
import { getByDataJS } from "../src/utils";
import "../src/global";

async function init() {
    const orders = await getOrders();

    function OrderListDetails({ order }) {
        return /*html*/ `
    <div class="px-4">
            <pre>
                <code>
                    ${JSON.stringify(order, null, 2)}
                </code>
            </pre>
    </div>`;
    }

    getByDataJS("order-list").innerHTML = orders
        .map(
            (order) => /*html*/ `
    <details>
        <summary>${OrderlistItem({ order, as: "div" })}</summary>
        ${OrderListDetails({ order })}
    </details>`
        )
        .join("");
}

init();
