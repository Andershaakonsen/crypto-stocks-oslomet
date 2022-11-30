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
import { FetchError } from "ofetch";
import { mutate } from "swr";
import { useDashboard } from "./dashboard.state";
import { useMemo } from "react";
import { authFetch } from "utils/fetch";

export const useStocks = () => {
    return useSWRAuth<Stock[]>("/api/Stocks/currencies", (url) =>
        authFetch(url).then((d) => d.data)
    );
};

export const useSelectedCurrency = () => {
    const selected = useDashboard().selected;

    const { data: stocks, isLoading, error } = useStocks();

    const selectedCurrency = useMemo(
        () => stocks?.find((s) => s.symbol === selected),
        [selected, stocks]
    );

    return {
        data: selectedCurrency,
        isLoading,
        error,
    };
};

export const useWallets = () => {
    const user = useUser();
    return useSWRAuth<Wallet[]>({
        url: "/api/Wallets",
        query: { userId: user?.id },
    });
};

useWallets.key = (userId: number) => ({
    url: "/api/Wallets",
    query: { userId },
});

export const useOrders = (limit: number = 3) => {
    const user = useUser();
    return useSWRAuth<Transaction[]>({
        url: "/api/Stocks",
        query: { userId: user?.id, limit },
    });
};

useOrders.key = (userId: number, limit: number = 3) => ({
    url: "/api/Stocks",
    query: { userId, limit },
});

export const useDeposit = () => {
    const user = useUser();

    return useSWRMutation<
        ResponseData<Wallet>,
        FetchError,
        string,
        Pick<DepositDTO, "amount">
    >(
        "/api/Wallets",
        (url, { arg }) =>
            authFetch(url, {
                method: "POST",
                body: {
                    ...arg,
                    userId: user?.id,
                },
            }),
        {
            throwOnError: true,
            onSuccess: () => {
                mutate(useWallets.key(user!.id));
            },
        }
    );
};

export const useWithdraw = () => {
    const user = useUser();

    return useSWRMutation<
        ResponseData<Wallet>,
        FetchError,
        string,
        Pick<DepositDTO, "amount">
    >(
        "/api/Wallets",
        (url, { arg }) =>
            authFetch(url, {
                method: "PATCH",
                body: {
                    ...arg,
                    userId: user?.id,
                },
            }),
        {
            throwOnError: true,
            onSuccess: () => {
                mutate(useWallets.key(user!.id));
            },
        }
    );
};

export const useUSDWallet = () => {
    const { data: wallets } = useWallets();

    return useMemo(() => wallets?.find((w) => w.symbol === "USD"), [wallets]);
};
