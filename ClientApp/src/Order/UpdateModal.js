/**
 * Update Modal
 * Contains Web component for update modal
 * Written using WebComponents in order to efficiently bind events & reusable code
 * Essentially mimmics React lifecycle methods
 * @source https://developer.mozilla.org/en-US/docs/Web/Web_Components
 */

import { updateOrder } from "../api";
import { updateWallets } from "../dashboard/WalletManager";
import { orderListState } from "../state";
import { Toast } from "../utils";
import OrderList from "./OrderList";

class UpdateModal extends HTMLElement {
    mounted = false;
    open = false;
    currentOrder = null;
    constructor() {
        super();

        this.innerHTML = /*html*/ `
        <article class="modal fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden w-[350px] rounded-lg max-h-[300px] bg-radix-slate4 z-[999] p-4" data-js="sell-modal">
            <h1 class="text-lg font-medium">
                Update Position
            </h1>
            
            <form class="flex flex-col gap-2 mt-4">
                <label class="flex flex-col">
                    <span class="text-sm font-medium">Quantity</span>
                    <input type="number" name="units" step="any" placeholder="Quantity of currency" required class="border border-radix-slate3 rounded p-2" />
                </label>

                <div class="flex mt-4 items-center justify-around">
                    <button data-js="cancel-button" type="button" class="text-radix-slate11 bg-radix-slate3 border slate-border-int p-1 rounded">
                        Cancel
                    </button>

                    <button type="submit" class="text-radix-blue11 bg-radix-blue3 border blue-border-int p-1 rounded">
                        Update
                    </button>
                </div>
            </form>
        </article> 
        <span class="modal-backdrop fixed top-0 left-0 w-full h-full backdrop-blur-lg z-50 hidden bg-black bg-opacity-5" data-js="sell-modal-backdrop"></span>
        `;
    }

    show = () => {
        this.modal.classList.remove("hidden");
        this.backdrop.classList.remove("hidden");
    };

    hide = () => {
        this.modal.classList.add("hidden");
        this.backdrop.classList.add("hidden");
    };

    updateModal = () => {
        this.open ? this.show() : this.hide();

        // Update the order input value
        if (this.currentOrder) {
            this.input.value = this.currentOrder.units;
        }
    };

    handleClose = () => {
        this.setAttribute("data-open", "false");
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const units = formData.get("units");

        // Request update
        try {
            const response = await updateOrder(this.orderId, {
                units,
            });

            console.log(response);

            Toast.success("Order updated successfully, balance updated");
            this.handleClose();

            await OrderList.mutate();
            updateWallets();
        } catch (error) {
            Toast.error(error.message);
        }
    };

    // On mount
    connectedCallback() {
        this.mounted = true;
        this.modal = this.querySelector('[data-js="sell-modal"]');
        this.backdrop = this.querySelector('[data-js="sell-modal-backdrop"]');
        this.cancelBtn = this.querySelector('[data-js="cancel-button"]');
        this.input = this.querySelector("input");
        this.form = this.querySelector("form");
        this.orderId = parseInt(this.dataset.orderId);

        // Update modal based on props
        this.updateModal();

        this.backdrop.addEventListener("click", this.handleClose);
        this.cancelBtn.addEventListener("click", this.handleClose);
        this.form.addEventListener("submit", this.handleSubmit);

        // Set current order from global state
        this.currentOrder = orderListState
            .get()
            .find((o) => o.id === this.orderId);
    }

    // On unmount
    disconnectedCallback() {
        this.backdrop.removeEventListener("click", this.handleClose);
        this.cancelBtn.removeEventListener("click", this.handleClose);
        this.form.removeEventListener("submit", this.handleSubmit);
        this.modal = null;
        this.backdrop = null;
        this.orderId = null;
    }

    // Listen to data-js-order-id attribute changes
    static get observedAttributes() {
        return ["data-order-id", "data-open"];
    }

    attributeChangedCallback(name, _, newValue) {
        if (!this.mounted) return; // Don't update if not mounted
        if (name === "data-order-id") {
            this.orderId = newValue;
        }

        if (name === "data-open") {
            this.open = newValue === "true";
            this.updateModal();
        }
    }
}

customElements.define("update-modal", UpdateModal);
