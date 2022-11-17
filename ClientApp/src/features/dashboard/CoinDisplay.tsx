interface Props {}

const CoinDisplay = () => {
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
