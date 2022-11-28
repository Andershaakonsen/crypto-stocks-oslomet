import { useDashboard } from "./dashboard.state";
import { useStocks } from "./hooks";

interface Props {}

const CoinDisplay = () => {
    const { data: stocks } = useStocks();
    const { selected } = useDashboard();

    return (
        <main className="pt-4 pl-2">
            <h2>
                Current Price: <span className="font-bold"></span>$
            </h2>
            <h3>24h change</h3>
            <p className="text-radix-slate11">last updated</p>
        </main>
    );
};

export default CoinDisplay;
