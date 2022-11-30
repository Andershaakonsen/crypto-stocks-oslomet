import { useSWRAuth } from "features/auth/hooks";
import { Transaction } from "types/api";
import useSWRMutation from "swr/mutation";
import { authFetch } from "utils/fetch";
import { FetchError } from "ofetch";
import { Key, mutate } from "swr";
import { useUser } from "features/auth/AuthProvider";
import { useOrders, useWallets } from "features/dashboard/hooks";

export const useOrder = (orderId: Transaction["id"]) => {
    return useSWRAuth<Transaction>({
        url: `/api/Stocks/${orderId}`,
    });
};

useOrder.key = (orderId: Transaction["id"]) => ({
    url: `/api/Stocks/${orderId}`,
});

export const useCreateOrder = () => {
    const user = useUser();
    return useSWRMutation<
        Transaction,
        FetchError,
        Record<string, any>,
        { units: number; symbol: string }
    >(
        { url: "/api/Stocks", method: "POST" },
        ({ method, url }, { arg }) =>
            authFetch(url, {
                method,
                body: {
                    units: arg.units,
                    symbol: arg.symbol,
                    userId: user!.id,
                },
            }),
        {
            throwOnError: true,
            onSuccess() {
                mutate(useWallets.key(user!.id));
                mutate(useOrders.key(user!.id));
            },
        }
    );
};
