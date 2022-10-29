import { formatCurrency, getByDataJS } from "../utils";
import { dashboardState, orderState, walletState } from "./dashboard.state";
import * as API from "./dashboard.api";
import Toast from "../lib/toast";
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

orderState.subscribe(async ({ currency: fromCurrency, amount }) => {
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

    orderTotalValue.textContent = formatCurrency(total);
});

/**
 * @type {HTMLFormElement}
 */
const form = getByDataJS("order-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    handleOrderSubmit(Object.fromEntries(formData));
});

const UNIT_MULTIPLIER = 100000000; // This is the unit multiplier as some currencies can have a lot of decimals

async function handleOrderSubmit(formData) {
    const { selected: selectedCurrency } = dashboardState.get();
    const { mode, currency: fromCurrencySymbol } = orderState.get();

    const amount = parseFloat(formData.amount);

    // Total units to buy/sell of the selected currency. Computed from the amount of the opposite currency
    const totalUnits =
        fromCurrencySymbol === selectedCurrency.symbol
            ? amount
            : amount / selectedCurrency.quote.USD.price;

    const requestPromise = (
        mode === "buy" ? API.createBuyOrder : API.createSellOrder
    )({ units: totalUnits, currency: selectedCurrency });

    try {
        const order = await requestPromise;
        Toast.success("Order created successfully");
        console.log(order);
    } catch (error) {
        Toast.error(error.message);
    }
}
