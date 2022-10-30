import { dashboardState } from "../state";
import { getByDataJS } from "../utils";

const priceSpan = getByDataJS("currency-price");
const nameSpan = getByDataJS("currency-name");
const percentege24hSpan = getByDataJS("percent-change-24h");
const lastUpdatedSpan = getByDataJS("currency-last-updated");

dashboardState.subscribe(({ selected }) => {
    if (!selected) return;

    nameSpan.innerHTML = selected.name;
    priceSpan.innerHTML = parseFloat(selected.quote.USD.price).toFixed(2);

    const change = parseFloat(selected.quote.USD.percent_change_24h);
    if (change > 0) {
        percentege24hSpan.classList.add("text-radix-green11");
        percentege24hSpan.classList.remove("text-radix-red11");
    } else {
        percentege24hSpan.classList.add("text-radix-red11");
        percentege24hSpan.classList.remove("text-radix-green11");
    }

    percentege24hSpan.innerHTML = change + "%";

    // Request a weekday along with a long date
    const lastUpdatedDate = new Date(selected.last_updated);

    lastUpdatedSpan.innerHTML = lastUpdatedDate.toLocaleString("nb-NO", {
        year: "numeric",
        month: "2-digit",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    console.log(selected);
});
