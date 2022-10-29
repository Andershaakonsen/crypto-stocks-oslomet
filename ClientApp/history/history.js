import "../src/style.scss";
import { initDarkMode } from "../src/lib/dark-mode";
import { getOrders } from "../src/dashboard/dashboard.api";
import { OrderlistItem } from "../src/dashboard/OrderList";
import { getByDataJS } from "../src/utils";
initDarkMode();

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
