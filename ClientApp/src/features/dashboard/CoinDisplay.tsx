import { useDashboard } from "./dashboard.state";
import { AdvancedChart } from "react-tradingview-embed";
import { useTheme } from "features/auth/ThemeProvider";

interface Props {}

// When done with getting selected currenc. CReate reusable hook for selected currency

const CoinDisplay = () => {
    const { selected } = useDashboard();
    const theme = useTheme();

    //doge

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

export default CoinDisplay;
