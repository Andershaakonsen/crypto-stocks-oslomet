import { useDashboard } from "./dashboard.state";

interface Props {}

// When done with getting selected currenc. CReate reusable hook for selected currency

const CoinDisplay = () => {
    const { selected } = useDashboard();

    return (
        <main>
            <iframe
                src={`https://bit2me.com/widget/chart/v1?currency=${
                    selected || "BTC"
                }&fiat=USDT`}
                className="block w-full h-full m-auto dark:invert "
            ></iframe>
        </main>
    );
};

export default CoinDisplay;
