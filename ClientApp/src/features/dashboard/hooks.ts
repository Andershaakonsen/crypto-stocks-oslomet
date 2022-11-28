import { useAccessToken, useUser } from "features/auth/AuthProvider";
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
import { mutate } from "swr";
import { useDashboard } from "./dashboard.state";
import { useMemo } from "react";

export const useStocks = () => useSWRAuth<Stock[]>("/api/Stocks");

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

export const useOrders = (limit: number = 10) => {
    const user = useUser();
    return useSWRAuth<Transaction[]>({
        url: "/api/Stocks/transactions",
        query: { userId: user?.id, limit },
    });
};

useOrders.key = (userId: number, limit: number = 10) => ({
    url: "/api/Orders",
    query: { userId, limit },
});

export const useDeposit = () => {
    const user = useUser();
    const accessToken = useAccessToken();

    return useSWRMutation<
        ResponseData<Wallet>,
        FetchError,
        string,
        Pick<DepositDTO, "amount">
    >(
        "/api/Wallets",
        (url, { arg }) =>
            ofetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    ...arg,
                    userId: user?.id,
                },
            }).then((d) => d.data),
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
    const accessToken = useAccessToken();

    return useSWRMutation<
        ResponseData<Wallet>,
        FetchError,
        string,
        Pick<DepositDTO, "amount">
    >(
        "/api/Wallets",
        (url, { arg }) =>
            ofetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    ...arg,
                    userId: user?.id,
                },
            }).then((d) => d.data),
        {
            throwOnError: true,
            onSuccess: () => {
                mutate(useWallets.key(user!.id));
            },
        }
    );
};
