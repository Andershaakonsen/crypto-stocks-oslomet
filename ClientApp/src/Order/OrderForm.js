import { getByDataJS, Toast } from "../utils";
import { dashboardState, orderState } from "../state";
import * as API from "../api";
import OrderList from "./OrderList";
import { updateWallets } from "../dashboard/WalletManager";

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
    const { currency: fromCurrencySymbol } = orderState.get();

    const amount = parseFloat(formData.amount);

    // Total units to buy/sell of the selected currency. Computed from the amount of the opposite currency
    const totalUnits =
        fromCurrencySymbol === selectedCurrency.symbol
            ? amount
            : amount / selectedCurrency.quote.USD.price;

    const payload = { units: totalUnits, currency: selectedCurrency };

    try {
        await API.createBuyOrder(payload);
        Toast.success("Order created successfully");
        // Call the API to update the order list

        OrderList.mutate();
        updateWallets();
    } catch (error) {
        Toast.error(error.message);
    }
}
