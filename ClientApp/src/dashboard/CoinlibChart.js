import { getByDataJS } from "../utils";
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

const html = ` <!-- COINLIB CHART START -->
<div
    style="
        height: 100%;
        background-color: var(--slate4);
        overflow: hidden;
        box-sizing: border-box;
        border: 1px solid #282e3b;
        border-radius: 4px;
        text-align: right;
        line-height: 14px;
        font-size: 12px;
        font-feature-settings: normal;
        text-size-adjust: 100%;
        box-shadow: inset 0 -20px 0 0 #262b38;
        padding: 1px;
        padding: 0px;
        margin: 0px;
        width: 100%;
    "
>
    <div
        style="
            height: 100%;
            padding: 0px;
            margin: 0px;
            width: 100%;
        "
    >
        <iframe
            data-js="coinlib-widget"
            src="https://widget.coinlib.io/widget?type=chart&theme=dark&coin_id=859&pref_coin_id=1505"
            width="100%"
            height="100%"
            scrolling="auto"
            marginwidth="0"
            marginheight="0"
            frameborder="0"
            border="0"
            style="
                border: 0;
                margin: 0;
                padding: 0;
                line-height: 14px;
            "
        ></iframe>
    </div>
    <div
        style="
            color: #626b7f;
            line-height: 14px;
            font-weight: 400;
            font-size: 11px;
            box-sizing: border-box;
            padding: 2px 6px;
            width: 100%;
            font-family: Verdana, Tahoma, Arial, sans-serif;
        "
    >
        <a
            href="https://coinlib.io"
            target="_blank"
            style="
                font-weight: 500;
                color: #626b7f;
                text-decoration: none;
                font-size: 11px;
            "
            >Cryptocurrency Prices</a
        >&nbsp;by Coinlib
    </div>
</div>`;
