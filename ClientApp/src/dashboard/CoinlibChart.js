import { getByDataJS } from "../utils/selectors";
import { wretch } from "../lib/request";
import { dashboardState } from "./dashboard.state";

/**
 * This is coinlib's API. It's a free API, but it's rate limited to 100 requests per hour.
 * Only for display purposes.
 * @url https://coinlib.io/apidocs
 * @copyright 2020 Coinlib
 */

const iframe = getByDataJS("coinlib-widget");

async function init() {
    // Fetch coin ids from Coinlib API
    try {
        const response = await fetch(
            "https://widget.coinlib.io/searchable_items_json",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "no-cors",
            }
        );

        const text = await response.text();

        console.log(text);

        const json = JSON.parse();

        const responseMap = json.reduce((acc, item) => {
            acc[item.symbol] = item.id;
            return acc;
        }, {});

        console.log(responseMap);

        dashboardState.subscribe(({ selected }) => {});
    } catch (error) {
        console.log(error);
    }
}

const CoinlibChart = {
    init,
};

export default CoinlibChart;
