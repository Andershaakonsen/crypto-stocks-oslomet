import { useUser } from "features/auth/AuthProvider";
import { useSWRAuth } from "features/auth/hooks";
import {
    DepositDTO,
    ResponseData,
    Stock,
    Transaction,
    Wallet,
} from "types/api";
import useSWRMutation from "swr/mutation";
import { FetchError, ofetch } from "ofetch";

export const useStocks = () => useSWRAuth<Stock[]>("/api/Stocks");

export const useWallets = () => {
    const user = useUser();
    return useSWRAuth<Wallet[]>({
        url: "/api/Wallets",
        query: { userId: user?.id },
    });
};

/**
 * @example const { data: orders } = useTransactions();
 */
export const useOrders = () => {
    const user = useUser();
    return useSWRAuth<Transaction[]>({
        url: "/api/Orders",
        query: { userId: user?.id, limit: 10 },
    });
};

export const useDeposit = () => {
    const user = useUser();

    return useSWRMutation<
        ResponseData<Wallet>,
        FetchError,
        string,
        Pick<DepositDTO, "amount">
    >("/api/Wallets", (url, { arg }) =>
        ofetch(url, {
            method: "POST",
            body: {
                ...arg,
                userId: user?.id,
            },
        }).then((d) => d.data)
    );
};
