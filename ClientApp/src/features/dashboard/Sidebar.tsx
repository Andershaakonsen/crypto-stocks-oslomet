import Details from "components/Details";

const Sidebar = () => {
    return (
        <aside className="left-sidebar relative">
            {/* Add backdrop-blur to div under*/}
            <div className="market-unselected absolute top-14 bg-slate-500 bg-opacity-20 h-[calc(100%_-_3.5rem)] w-full z-50">
                <div className="flex flex-col items-center justify-center space-y-4 h-full">
                    <i className="gg-search" style={{ "-ggs": "3" } as any}></i>
                    <div className="pt-4">
                        <span className="text-radix-slate12">
                            Select a currency
                        </span>
                    </div>
                </div>
            </div>
            {/* SELCT MARKET START */}
            <section className="h-14 shrink-0 border-b border-radix-slate6 sticky top-0 bg-radix-slate1 z-10">
                <div className="flex h-full items-center justify-between text-sm ">
                    <select
                        className="select-market-btn max-w-[7rem] outline-radix-blue9"
                        name="market"
                        value=""
                    >
                        <option disabled value="">
                            Select Market
                        </option>
                    </select>
                </div>
            </section>
            {/* WALLET BALANCE START */}
            <Details title="Wallet Balance">
                <section className="panel py-1">
                    <div className="flex items-center justify-between">
                        <span className="text-radix-slate11">Asset</span>
                        <span className="text-radix-slate11">Amount</span>
                    </div>
                </section>
                <section className="panel py-6">
                    <ul className="space-y-4 max-h-[200px] overflow-y-auto">
                        <li className="flex items-center justify-between">
                            <span className="">USDT</span>
                            <span className="font-medium">0.00</span>
                        </li>
                    </ul>
                    <div className="mt-4 flex items-center gap-3">
                        <button className="h-14 px-3 flex space-x-3 items-center border slate-border-int text-radix-slate11 hover:text-radix-slate12">
                            <i className="gg-arrow-down-o"></i>
                            <span>Deposit</span>
                        </button>
                        <button className="h-14 px-3 flex space-x-3 items-center border slate-border-int text-radix-slate11 hover:text-radix-slate12">
                            <i className="gg-arrow-down-o"></i>
                            <span>Withdraw</span>
                        </button>
                    </div>
                </section>
            </Details>

            {/* ORDER FROM START */}
            <section className="py-3 panel sticky top-14">
                <h1 className="title">Order Form</h1>
            </section>
            <section className="py-6 panel grow">
                <div className="grid grid-cols-1">
                    <button className="py-1 green-solid-int">BUY</button>
                </div>
                <div className="mt-4">
                    <form>
                        <label className="text-radix-slate11">Amount</label>
                        <div className="h-14 pl-3 gap-2 bg-radix-slate5 w-full flex items-center mt-1 focus-within:ring-1 focus-within:ring-radix-blue9">
                            <input
                                className="block bg-transparent h-full w-full indent-12 text-right outline-none"
                                type="number"
                                placeholder="0.00"
                                name="amount"
                                required
                            />
                            <select
                                className="bg-transparent border-l border-l-radix-slate1 h-full px-2 hover:bg-radix-slate6"
                                value="USDT"
                            >
                                <option value="USDT">USDT</option>
                                <option disabled></option>
                            </select>
                        </div>
                        <span className="mt-6 block w-full h-[2px] bg-radix-slate6"></span>
                        <div className="flex items-center justify-between my-3 text-sm">
                            Total = <span className="flex gap-2">USDT</span>
                            <span className="max-w-[80px] truncate block">
                                0.00
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="h-14 flex justify-center items-center green-solid-int w-full mt-6 "
                        >
                            PLACE ORDER
                        </button>
                    </form>
                </div>
            </section>
        </aside>
    );
};

export default Sidebar;
