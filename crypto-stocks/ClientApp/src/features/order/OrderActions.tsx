import { DialogClose } from "@radix-ui/react-dialog";
import { Button, TextField } from "components";
import { Dialog, DialogTitle } from "components/dialog";
import { useToast } from "context/ToastContext";
import { useAccessToken, useUser } from "features/auth/AuthProvider";
import { useOrders, useWallets } from "features/dashboard/hooks";
import { ofetch } from "ofetch";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";
import { Transaction } from "types/api";
import { useOrder } from "./hooks";

type Props = {
    orderId: Transaction["id"];
};

const OrderActions = ({ orderId }: Props) => {
    const accessToken = useAccessToken();
    const user = useUser()!;
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSellClick = async () => {
        try {
            setLoading(true);
            await ofetch(`/api/Stocks/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                method: "DELETE",
            });

            // Mutate all dependant queries
            await Promise.all([
                mutate(useWallets.key(user.id)),
                mutate(useOrders.key(user.id)),
                mutate(useOrders.key(user.id, 100)),
            ]);

            toast.success("Order sold successfully");
        } catch (error) {
            toast.error(error?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex items-center gap-2 justify-end">
            <UpdateOrderModal orderId={orderId}>
                <Button size="sm" color="green">
                    Update
                </Button>
            </UpdateOrderModal>

            <Button
                loading={loading}
                onClick={handleSellClick}
                color="red"
                size="sm"
            >
                Sell
            </Button>
        </div>
    );
};

export default OrderActions;

interface FormData {
    units: number;
}

const UpdateOrderModal = ({
    orderId,
    children,
}: React.PropsWithChildren<{ orderId: Transaction["id"] }>) => {
    const accessToken = useAccessToken();

    const [open, setOpen] = useState(false);
    const user = useUser()!;
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { data: order } = useOrder(orderId);

    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async ({ units }) => {
        try {
            setLoading(true);
            await ofetch(`/api/Stocks/${orderId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: { units },
            });

            // Mutate all dependant queries
            await Promise.all([
                mutate(useWallets.key(user.id)),
                mutate(useOrders.key(user.id)),
                mutate(useOrder.key(orderId)),
            ]);

            toast.success("Order updated successfully");

            setLoading(false);
            setOpen(false);
        } catch (error) {
            toast.error(error?.data || error.message);
            setLoading(false);
        }
    };

    // Reset form when order changes
    useEffect(() => {
        if (order)
            resetField("units", {
                defaultValue: order.units,
            });
    }, [order]);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => setOpen(open)}
            trigger={children}
        >
            <DialogTitle className="text-lg font-medium">
                Update Position
            </DialogTitle>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2 mt-4"
            >
                <TextField
                    error={errors.units?.message}
                    label="Quantity"
                    {...register("units", {
                        required: "Units field is required",
                        valueAsNumber: true,
                        validate(value) {
                            return isNaN(value) ? "Invalid number" : true;
                        },
                    })}
                />
                <div className="flex mt-4 items-center justify-around">
                    <DialogClose asChild>
                        <Button color="slate" type="button">
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button loading={loading} type="submit" color="blue">
                        Update
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};
