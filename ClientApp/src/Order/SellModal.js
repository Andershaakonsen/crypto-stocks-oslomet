/**
 * Sell Modal
 * Contains Web component for sell modal
 * Written using WebComponents in order to efficiently bind events & reusable code
 * Essentially mimmics React lifecycle methods
 * @source https://developer.mozilla.org/en-US/docs/Web/Web_Components
 * @author Sanna Jammeh
 */

export class SellModal extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/ `<div class="modal fixed top-1/2 left-1/2" data-js="sell-modal">
            Hello world
        </div>`;
    }

    // On mount
    connectedCallback() {
        this.modal = this.querySelector('[data-js="sell-modal"]');
        this.orderId = this.dataset.orderId;
    }

    // On unmount
    disconnectedCallback() {
        this.modal = null;
        this.orderId = null;
    }

    // Listen to data-js-order-id attribute changes
    static get observedAttributes() {
        return ["data-order-id"];
    }

    attributeChangedCallback(name, _, newValue) {
        if (name === "data-order-id") {
            this.orderId = newValue;
        }
    }
}
