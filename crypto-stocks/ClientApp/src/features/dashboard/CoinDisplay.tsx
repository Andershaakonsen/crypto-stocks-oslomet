import { useDashboard } from "./dashboard.state";
import { AdvancedChart } from "react-tradingview-embed";
import { useTheme } from "features/auth/ThemeProvider";
import { memo } from "react";

/**
 * Custom coin chart component
 * Uses TradingView charting library `react-tradingview-embed`
 * @see https://www.npmjs.com/package/react-tradingview-embed
 */
const CoinDisplay = () => {
    const { selected } = useDashboard();
    const theme = useTheme();

    return (
        <main>
            <AdvancedChart
                widgetProps={{
                    autosize: true,
                    symbol:
                        selected === "USDT"
                            ? "CRYPTOCAP:USDT"
                            : selected === "USDC"
                            ? "CRYPTOCAP:USDC"
                            : `BINANCE:${selected}USDT`,
                    theme: theme,
                    hide_side_toolbar: true,
                    timezone: "Europe/Amsterdam",
                    allow_symbol_change: false,
                }}
            />
        </main>
    );
};

export default memo(CoinDisplay);
