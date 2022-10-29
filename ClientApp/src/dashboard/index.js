import * as Api from "./dashboard.api";
import { getByDataJS } from "../utils";
import CurrencyLabel from "./CurrencyLabel";
import { dashboardState as state } from "./dashboard.state";
import { animateClass as animateClassName } from "../lib/animate";
import WalletManager from "./WalletManager";
import "./OrderForm";
import CoinlibChart from "./CoinlibChart";

const pairSelector = getByDataJS("pair-selector");

async function init() {
    const data = await Api.getListings();
    state.set((p) => ({ ...p, listings: data }));
    CoinlibChart.init();
    WalletManager();
}

/**
 * Create currency pair list
 */
let listingsRendered = false;

state.subscribe(({ listings }) => {
    if (!listingsRendered && listings.length) {
        pairSelector.innerHTML = /*html*/ `
    <option disabled selected>Select market</option>
    ${listings
        .map(
            (listing) => /*html*/ `
      <option value="${listing.symbol}">${listing.name}</option>
      `
        )
        .join("")}
  `;

        listingsRendered = true;
    }
});

state.subscribe(({ selected }) => {
    // Label
    getByDataJS("currency-pair-display").innerHTML = CurrencyLabel({
        currency: selected,
    });

    const placeholder = getByDataJS("order-placeholder");
    placeholder.style.display = "none"; // TODO - Remove
    if (selected)
        animateClassName(placeholder, "fadeOut").then(() => {
            placeholder.style.display = "none";
        });
    else placeholder.style.display = "block";

    // Set order form select
    if (selected) {
        const orderCurrencySymbol = getByDataJS("order-currency-symbol");
        orderCurrencySymbol.value = selected?.symbol;
        orderCurrencySymbol.innerHTML = selected?.symbol;
        orderCurrencySymbol.disabled = false;
    }
});

pairSelector.addEventListener("change", ({ target }) => {
    const selected = state
        .get()
        .listings.find((l) => l.symbol === target.value);
    pairSelector.value = selected.symbol;
    state.set((p) => ({ ...p, selected }));
});

/**
 * Exports
 */

const Dashboard = {
    init,
    state: state,
};

export default Dashboard;
