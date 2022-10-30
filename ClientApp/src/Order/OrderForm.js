import { formatCurrency, getByDataJS, Toast } from "../utils";
import { dashboardState, orderState, walletState } from "../state";
import * as API from "../api";
import OrderList from "./OrderList";
import { updateWallets } from "../dashboard/WalletManager";
/**
 * This file contains the full functionality for the order form.
 */

const buyToggle = getByDataJS("buy-toggle");
const sellToggle = getByDataJS("sell-toggle");

buyToggle.addEventListener("click", () =>
    orderState.set((p) => ({ ...p, mode: "buy" }))
);
sellToggle.addEventListener("click", () =>
    orderState.set((p) => ({ ...p, mode: "sell" }))
);

/** RENDER ORDER TOGGLE */
orderState.subscribe(({ mode }) => {
    if (mode === "buy") {
        buyToggle.classList.add("green-solid-int");
        buyToggle.classList.remove("slate-cta-int");
        buyToggle.classList.remove("text-radix-slate11");

        sellToggle.classList.remove("red-solid-int");
        sellToggle.classList.add("slate-cta-int");
        sellToggle.classList.add("text-radix-slate11");
    } else {
        sellToggle.classList.add("red-solid-int");
        sellToggle.classList.remove("slate-cta-int");
        sellToggle.classList.remove("text-radix-slate11");

        buyToggle.classList.remove("green-solid-int");
        buyToggle.classList.add("slate-cta-int");
        buyToggle.classList.add("text-radix-slate11");
    }
});

/**
 * RENDER ORDER DATA
 */

const orderCurrencyOption = getByDataJS("order-currency-symbol");
const orderCurrencySelect = getByDataJS("order-currency-select");
const orderAmountInput = getByDataJS("order-amount-input");
const orderTotalSymbol = getByDataJS("order-total-symbol");
const orderTotalValue = getByDataJS("order-total-value");
const maxAmountButton = getByDataJS("max-btn");

dashboardState.on(
    (p) => p.selected,
    ({ selected }) => {
        // Populate the order input with the selected currency
        orderCurrencyOption.textContent = selected.symbol;
        orderCurrencyOption.value = selected.symbol;
        orderCurrencyOption.disabled = false;

        // Populate the order total with the selected currency
        orderTotalSymbol.textContent = selected.symbol;
    }
);

orderCurrencySelect.addEventListener("change", (e) =>
    orderState.set((s) => ({ ...s, currency: e.target.value }))
);

orderAmountInput.addEventListener("input", (e) => {
    const value = e.target.value;
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
        orderState.set((s) => ({ ...s, amount: 0 }));
    } else {
        orderState.set((s) => ({ ...s, amount: parsed }));
    }
});

// Render the total value of the order
orderState.subscribe(({ currency: fromCurrency, amount }) => {
    // Wait for the user to select a currency
    const { selected: currency } = dashboardState.get();
    if (!currency) return;

    // Populate the Total symbol with the opposite of the selected currency
    orderTotalSymbol.textContent =
        fromCurrency === currency.symbol ? "USDT" : currency.symbol;

    // Calculate the total value, if the currency is the same as the selected currency, then we need to convert it to USDT
    const {
        quote: {
            USD: { price },
        },
    } = currency;
    const total =
        fromCurrency === currency.symbol ? amount * price : amount / price;

    orderTotalValue.textContent = total;
});

// Update the input when the user clicks the max button
maxAmountButton.addEventListener("click", () => {
    const { selected: currency } = dashboardState.get();
    const { mode, currency: fromCurrency } = orderState.get();
    if (mode === "sell") return;

    const { USD } = walletState.get();
    const { balance } = USD;

    const amount =
        fromCurrency === currency.symbol
            ? balance / currency.quote.USD.price
            : balance;

    console.log(amount);
});

/**
 * Submit the order to the API
 * @type {HTMLFormElement}
 */
const form = getByDataJS("order-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    handleOrderSubmit(Object.fromEntries(formData));
});

async function handleOrderSubmit(formData) {
    const { selected: selectedCurrency } = dashboardState.get();
    const { mode, currency: fromCurrencySymbol } = orderState.get();

    const amount = parseFloat(formData.amount);

    // Total units to buy/sell of the selected currency. Computed from the amount of the opposite currency
    const totalUnits =
        fromCurrencySymbol === selectedCurrency.symbol
            ? amount
            : amount / selectedCurrency.quote.USD.price;

    const payload = { units: totalUnits, currency: selectedCurrency };
    const request = (mode === "buy" ? API.createBuyOrder : API.createSellOrder)(
        payload
    );

    try {
        await request;
        Toast.success("Order created successfully");
        // Call the API to update the order list

        OrderList.mutate();
        updateWallets();
    } catch (error) {
        Toast.error(error.message);
    }
}
