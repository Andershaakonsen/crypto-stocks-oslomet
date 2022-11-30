import clsx from "clsx";
import { Button, TextField } from "components";
import { useToast } from "context/ToastContext";
import { useSelectedCurrency } from "features/dashboard/hooks";
import { FetchError } from "ofetch";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { proxy, useSnapshot } from "valtio";
import { useCreateOrder } from "./hooks";

interface OrderState {
    mode: "buy" | "sell";
    using: string;
}

export const orderState = proxy<OrderState>({
    mode: "buy",
    using: "USDT",
});

export const useOrderState = () => useSnapshot(orderState);

interface FormData {
    amount: number;
}

const OrderForm = () => {
    const {
        trigger,
        error,
        isMutating,
        reset: resetFetcher,
    } = useCreateOrder();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { data: currency } = useSelectedCurrency();
    const { using } = useOrderState();
    const {
        register,
        watch,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<{
        amount: number;
    }>({
        defaultValues: {
            amount: 0,
        },
    });

    const amount = watch("amount") || 0;

    /**
     * Computed values based on what the user has selected as the currency to convert from
     */
    const computed = useMemo(() => {
        if (!currency) return;

        const {
            quote: {
                USD: { price },
            },
        } = currency;

        const total =
            using === currency.symbol ? amount * price : amount / price;
        const symbol = using === currency.symbol ? "USDT" : currency.symbol;
        const units = using === currency.symbol ? amount : amount / price;

        return {
            total,
            symbol,
            units,
        };
    }, [currency, amount, using]);

    const onSubmit: SubmitHandler<FormData> = async ({ amount }) => {
        if (!currency) return;

        const units =
            using === currency.symbol
                ? amount
                : amount / currency.quote.USD.price;

        try {
            await trigger({ symbol: currency.symbol, units });

            // Buy completed. Reset form
            reset();

            toast.success("Order completed successfully");
            setLoading(false);
        } catch (error) {
            if (error instanceof FetchError) {
                toast.error(error.data || error.message);
            }
        }
    };

    const errorMsg = errors.amount?.message || error?.data || error?.message;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className="text-radix-slate11" htmlFor="amount">
                {errorMsg ? (
                    <span className="text-radix-red11">{errorMsg}</span>
                ) : (
                    "Amount"
                )}
            </label>
            <div
                className={clsx(
                    "h-14 pl-3 gap-2 bg-radix-slate5 w-full flex items-center mt-1 focus-within:ring-1 focus-within:ring-radix-blue9",
                    errorMsg && "ring !ring-radix-red9"
                )}
            >
                <TextField
                    error={errorMsg}
                    className="block bg-transparent !border-transparent !ring-0 h-full w-full indent-12 text-right outline-none"
                    placeholder="0.00"
                    id="amount"
                    onInput={() => resetFetcher()}
                    {...register("amount", {
                        required: "Amount is required",
                        min: {
                            value: 1,
                            message: "Amount must be greater than 0",
                        },
                        valueAsNumber: true,

                        validate: (value) => {
                            if (isNaN(value)) {
                                return "Amount must be a number";
                            }
                        },
                    })}
                    required
                />
                <select
                    className="bg-transparent border-l border-l-radix-slate8 h-full px-2 hover:bg-radix-slate6"
                    value={using}
                    onChange={(e) => (orderState.using = e.target.value)}
                >
                    <option value="USDT">USDT</option>
                    <option value={currency?.symbol}>{currency?.symbol}</option>
                </select>
            </div>
            <span className="mt-6 block w-full h-[2px] bg-radix-slate6"></span>
            <div className="flex items-center justify-between my-3 text-sm">
                <span className="text-radix-slate11">Total =</span>
                <span className="flex gap-2">
                    {computed?.symbol}{" "}
                    <span className="max-w-[80px] truncate block">
                        {computed?.total}
                    </span>
                </span>
            </div>
            <Button
                type="submit"
                color={errorMsg ? "red" : "green"}
                className="w-full !rounded-none h-14"
                loading={loading || isMutating}
            >
                PLACE ORDER
            </Button>
        </form>
    );
};

export default OrderForm;
