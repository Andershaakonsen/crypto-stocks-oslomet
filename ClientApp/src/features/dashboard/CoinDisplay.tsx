import { useLayoutEffect, useRef } from "react";
import { useDashboard } from "./dashboard.state";

interface Props {}

// When done with getting selected currenc. CReate reusable hook for selected currency

const CoinDisplay = () => {
    const { selected } = useDashboard();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useLayoutEffect(() => {
        const w = iframeRef.current?.contentWindow;
        if (!w) return;

        (w as any).console.log = () => {};
    }, []);

    return (
        <main>
            <iframe
                ref={iframeRef}
                src={`https://bit2me.com/widget/chart/v1?currency=${
                    selected || "BTC"
                }&fiat=USDT`}
                className="block w-full h-full m-auto dark:invert "
            />
        </main>
    );
};

export default CoinDisplay;
