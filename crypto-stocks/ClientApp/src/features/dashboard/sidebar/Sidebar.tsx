import { Button } from "components";
import Details from "components/Details";
import OrderForm, { orderState, useOrderState } from "features/order/OrderForm";
import React, { useEffect, useMemo, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { dashboardState, useDashboard } from "../dashboard.state";
import { useStocks, useWallets } from "../hooks";
import WalletActions from "./WalletActions";
import clsx from "clsx";

const Loading = () => {
    return (
        <aside className="left-sidebar relative">
            <div className="absolute-center">
                <CgSpinner size="2rem" className="animate-spin" />
            </div>
        </aside>
    );
};

const Sidebar = () => {
    const { data: stocks, isLoading } = useStocks();
    const selected = useDashboard().selected;
    const { data: wallets, isLoading: walletLoading } = useWallets();
    const orderMode = useOrderState().mode;

    const currency = useMemo(() => {
        return stocks?.find((s: any) => s.symbol === selected);
    }, [selected, stocks]);

    if (isLoading || walletLoading) return <Loading />;

    return (
        <aside className="left-sidebar relative">
            {!currency && <NoSelectPlaceholder />}
            <MarketSelector />
            <Details defaultOpen title="Wallet Balance">
                <section className="panel py-1">
                    <div className="flex items-center justify-between">
                        <span className="text-radix-slate11">Asset</span>
                        <span className="text-radix-slate11">Amount</span>
                    </div>
                </section>
                <section className="panel py-6">
                    <ul className="space-y-4 max-h-[200px] overflow-y-auto">
                        {!wallets?.length && (
                            <li className="text-center text-radix-slate11">
                                No wallets found. Please deposit funds.
                            </li>
                        )}
                        {wallets?.map((wallet) => (
                            <li
                                key={wallet.id}
                                className="flex items-center justify-between"
                            >
                                <span className="">{wallet.symbol}</span>
                                <span className="font-medium">
                                    {wallet.balance}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <WalletActions />
                </section>
            </Details>

            {/* ORDER FROM START */}
            <section className="py-3 panel sticky top-14">
                <h1 className="title">Order Form</h1>
            </section>
            <section className="py-6 panel grow">
                <div className="grid grid-cols-1">
                    <ModeDisplay />
                </div>
                <div className="mt-4">
                    <OrderForm />
                </div>
            </section>
        </aside>
    );
};

export default Sidebar;

const MarketSelector = () => {
    const { data: stocks, isLoading } = useStocks();
    const selected = useDashboard().selected;

    const stocksWithoutUSDT = useMemo(() => {
        return stocks?.filter((s: any) => s.symbol !== "USDT");
    }, [stocks]);

    return (
        <section className="h-14 shrink-0 border-b border-radix-slate6 sticky top-0 bg-radix-slate1 z-10">
            <div className="flex h-full items-center justify-between text-sm gap-4">
                {selected && <Coin symbol={selected} />}
                <select
                    className="select-market-btn max-w-[7rem] outline-radix-blue9"
                    name="market"
                    value={selected}
                    onChange={(e) => (dashboardState.selected = e.target.value)}
                >
                    <option disabled value="">
                        Select Market
                    </option>
                    {stocksWithoutUSDT?.map((stock: any) => (
                        <option key={stock.id} value={stock.symbol}>
                            {stock.name} ({stock.symbol})
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
};

const Coin = ({ symbol = "X" }) => {
    const [Component, setComponent] = useState<null | React.FC<
        React.SVGProps<SVGElement>
    >>(null);

    const lower = symbol.toLowerCase();

    const actualSymbol = lower === "busd" ? "bnb" : lower;

    // Dynamically import the coin image
    useEffect(() => {
        import(`../../../../assets/crypto-svg/${actualSymbol}.svg`)
            .then((img) => {
                setComponent(() => img.ReactComponent);
            })
            .catch((e) => {
                console.log(e);
                setComponent(null);
            });
    }, [actualSymbol]);
    return <>{Component && <Component className="h-8 w-8" />}</>;
};

const ModeDisplay = () => {
    const mode = useOrderState().mode;

    return (
        <div className="w-full grid grid-cols-1">
            <Button
                color={"green"}
                size="sm"
                className={clsx("!rounded-none border-dotted !bg-transparent")}
            >
                BUY
            </Button>
        </div>
    );
};

const NoSelectPlaceholder = () => (
    <div className="market-unselected absolute top-14 bg-black bg-opacity-40 backdrop-blur h-[calc(100%_-_3.5rem)] w-full z-50">
        <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <i className="gg-search" style={{ "--ggs": "3" } as any}></i>
            <div className="pt-4">
                <span className="text-radix-slate12">Select a currency</span>
            </div>
        </div>
    </div>
);
