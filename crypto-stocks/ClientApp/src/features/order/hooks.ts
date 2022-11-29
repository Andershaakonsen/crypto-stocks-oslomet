import { useSWRAuth } from "features/auth/hooks";
import { Transaction } from "types/api";

export const useOrder = (orderId: Transaction["id"]) => {
    return useSWRAuth<Transaction>({
        url: `/api/Stocks/${orderId}`,
    });
};

useOrder.key = (orderId: Transaction["id"]) => ({
    url: `/api/Stocks/${orderId}`,
});
