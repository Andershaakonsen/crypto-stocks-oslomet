/**
 * Order Actions
 * Contains components for order list items
 * Written using WebComponents in order to efficiently bind events
 * Essentially mimmics React lifecycle methods
 * @source https://developer.mozilla.org/en-US/docs/Web/Web_Components
 * @author Sanna Jammeh
 */

import { sellOrder, updateOrder } from "../api";
import { Toast } from "../utils";
import OrderList from "./OrderList";

export class OrderActions extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/ `<div class="flex items-center gap-2 justify-end">
        <button
            class="flex items-center bg-radix-green3 text-radix-green11 text-sm py-1 px-2 rounded border green-border-int"
            data-js="edit-order-btn"
            data-order-id="${this.dataset.orderId}"
        >
            Update
        </button>
        <button
            class="flex items-center bg-radix-red3 text-radix-red11 text-sm py-1 px-2 rounded border red-border-int"
            data-js="cancel-order-btn"
            data-order-id="${this.dataset.orderId}"
        >
            Sell
        </button>
    </div>`;
    }

    handleSellOrder = async () => {
        try {
            const response = await sellOrder(this.orderId);
            console.log(
                "🚀 ~ file: OrderActions.js ~ line 34 ~ OrderActions ~ handleSellOrder= ~ response",
                response
            );

            this.revalidateOrders();
        } catch (error) {
            Toast.error(error.message);
        }
    };

    handleEditOrder = async () => {
        try {
            const response = await updateOrder(this.orderId, {
                status: "updated",
            });
            console.log(
                "🚀 ~ file: OrderActions.js ~ line 45 ~ OrderActions ~ handleEditOrder= ~ response",
                response
            );

            this.revalidateOrders();
        } catch (error) {
            Toast.error(error.message);
        }
    };

    revalidateOrders = () => {
        OrderList.mutate();
    };

    setOrderId = (orderId) => {
        this.orderId = parseInt(orderId || this.dataset.orderId);
    };

    /**
     * On Mounted
     */
    connectedCallback() {
        const editOrderBtn = this.querySelector('[data-js="edit-order-btn"]');
        const cancelOrderBtn = this.querySelector(
            '[data-js="cancel-order-btn"]'
        );

        editOrderBtn.addEventListener("click", this.handleEditOrder);
        cancelOrderBtn.addEventListener("click", this.handleSellOrder);
        this.setOrderId();
    }

    static get observedAttributes() {
        return ["data-order-id"];
    }

    attributeChangedCallback(name, _, newValue) {
        if (name === "data-order-id") {
            this.setOrderId(newValue);
        }
    }

    /**
     * On Unmounted
     */
    disconnectedCallback() {
        // Remove event listeners

        const editOrderBtn = this.querySelector('[data-js="edit-order-btn"]');
        const cancelOrderBtn = this.querySelector(
            '[data-js="cancel-order-btn"]'
        );

        editOrderBtn.removeEventListener("click", this.handleEditOrder);

        cancelOrderBtn.removeEventListener("click", this.handleSellOrder);
    }
}

customElements.define("order-actions", OrderActions);
