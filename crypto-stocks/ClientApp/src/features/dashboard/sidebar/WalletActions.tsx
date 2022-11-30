import { classed } from "@tw-classed/react";
import { Button, TextField } from "components";
import { Dialog, DialogDescription, DialogTitle } from "components/dialog";
import { useToast } from "context/ToastContext";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDeposit, useUSDWallet, useWithdraw } from "../hooks";

const WalletActions = () => {
    return (
        <div className="mt-4 flex items-center gap-3 w-max overflow-hidden">
            <DepositModal />
            <WithdrawModal />
        </div>
    );
};

export default WalletActions;

interface FormData {
    amount: number;
}

const DepositModal = ({}) => {
    const { trigger, error, isMutating, reset } = useDeposit();
    const [open, setOpen] = useState(false);
    const toast = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            await trigger(data);
            setOpen(false);
            toast.success("Deposit successful");
        } catch (error) {
            console.log(error);
            toast.error(error?.data);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
            trigger={
                <DepositButton>
                    <i className="gg-arrow-up-o"></i>
                    <span>Deposit</span>
                </DepositButton>
            }
        >
            <DialogTitle>Deposit</DialogTitle>
            <DialogDescription>
                Deposit funds into your wallet here.
            </DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    error={errors.amount?.message || error?.data?.message}
                    onInput={reset}
                    {...register("amount", {
                        required: "Please enter an amount",
                        valueAsNumber: true,
                        min: {
                            value: 1,
                            message: "Amount must be greater than 0",
                        },
                        validate(value) {
                            return isNaN(value) ? "Invalid number" : true;
                        },
                    })}
                    label="Amount"
                    type="text"
                />
                <Button loading={isMutating} size="sm" className="mt-2">
                    <span>Deposit</span>
                </Button>
            </form>
        </Dialog>
    );
};

const WithdrawModal = () => {
    const { trigger, error, isMutating, reset } = useWithdraw();
    const usdWallet = useUSDWallet();
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            await trigger(data);
            setOpen(false);
            toast.success("Withdrawal successful");
        } catch (error) {
            toast.error(error?.data);
        }
    };
    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
            trigger={
                <DepositButton>
                    <i className="gg-arrow-down-o"></i>
                    <span>Withdraw</span>
                </DepositButton>
            }
        >
            <DialogTitle>Withdraw</DialogTitle>
            <DialogDescription>
                Withdraw funds from your wallet here.
            </DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    onInput={reset}
                    error={errors.amount?.message || error?.data}
                    {...register("amount", {
                        required: "Please enter an amount",
                        valueAsNumber: true,
                        min: {
                            value: 1,
                            message: "Amount must be greater than 0",
                        },
                        validate(value) {
                            if (isNaN(value)) return "Invalid number";
                            if (usdWallet) {
                                if (value > usdWallet.balance) {
                                    return "Insufficient funds";
                                }
                            }
                        },
                    })}
                    label="Amount"
                />
                <Button
                    color="red"
                    loading={isMutating}
                    size="sm"
                    className="mt-2"
                >
                    <span>Withdraw</span>
                </Button>
            </form>
        </Dialog>
    );
};

const DepositButton = classed(
    "button",
    "h-14 px-3 flex space-x-3 items-center border slate-border-int text-radix-slate11 hover:text-radix-slate12 relative"
);
