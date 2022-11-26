import { useUser } from "features/auth/AuthProvider";
import { useSWRAuth } from "features/auth/hooks";
import { Stock } from "types/api";

export const useStocks = () => useSWRAuth<Stock[]>("/api/Stocks");

export const useWallets = () => {
    const user = useUser();
    return useSWRAuth({
        url: "/api/Wallets",
        query: { userId: user?.uid },
    });
};

export const useOrders = () => {
    const user = useUser();
    return useSWRAuth({
        url: "/api/Orders",
        query: { userId: user?.uid, limit: 10 },
    });
};
