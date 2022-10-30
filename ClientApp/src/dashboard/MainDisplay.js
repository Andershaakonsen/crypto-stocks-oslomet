import { dashboardState } from "../state";
import { getByDataJS } from "../utils";

const priceSpan = getByDataJS("currency-price");

dashboardState.subscribe(({ selected }) => {
    if (!selected) return;
    console.log(selected);
});
