/**
 * Order Actions
 * Contains components for order list items
 * Written using WebComponents in order to efficiently bind events
 * Essentially mimmics React lifecycle methods
 * @source https://developer.mozilla.org/en-US/docs/Web/Web_Components
 */

import { sellOrder } from "../api";
import { updateWallets } from "../dashboard/WalletManager";
import { Toast } from "../utils";
import OrderList from "./OrderList";
import "./UpdateModal";

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
        <update-modal data-order-id="${this.dataset.orderId}" data-open="false"></update-modal>
    </div>`;
    }

    handleSellClick = async () => {
        try {
            await sellOrder(this.orderId);

            this.revalidateOrders();
            Toast.success("Order sold successfully");
        } catch (error) {
            Toast.error(error.message);
        }
    };

    handleEditClick = async () => {
        this.modal.setAttribute("data-open", "true");
    };

    // Update all the related data when called
    revalidateOrders = () => {
        updateWallets();
        OrderList.mutate();
    };

    setOrderId = (orderId) => {
        this.orderId = parseInt(orderId || this.dataset.orderId);
    };

    /**
     * On Mounted
     */
    connectedCallback() {
        this.modal = this.querySelector("sell-modal");
        const editOrderBtn = this.querySelector('[data-js="edit-order-btn"]');
        const cancelOrderBtn = this.querySelector(
            '[data-js="cancel-order-btn"]'
        );

        editOrderBtn.addEventListener("click", this.handleEditClick);
        cancelOrderBtn.addEventListener("click", this.handleSellClick);
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

        editOrderBtn.removeEventListener("click", this.handleEditClick);

        cancelOrderBtn.removeEventListener("click", this.handleSellClick);
    }
}

customElements.define("order-actions", OrderActions);
