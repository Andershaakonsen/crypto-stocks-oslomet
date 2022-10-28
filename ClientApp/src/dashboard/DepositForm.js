import { getByDataJS } from "../lib/selectors";
import Toast from "../lib/toast";
import * as API from "./dashboard.api";
const depositBtn = getByDataJS("deposit-btn");
const withDrawBtn = getByDataJS("withdraw-btn");

const depositOrWithdraw = async (amount, type) => {
    try {
        const response =
            type === "deposit"
                ? await API.deposit(amount)
                : await API.withdraw(amount);
    } catch (error) {
        Toast.error(
            `Could not complete ${type} request. Error: ${error.message}`
        );
    }
};

export default function WalletManager() {
    depositBtn.addEventListener("click", () => {
        const amount = prompt("Enter amount to deposit");

        if (validateAmount(amount)) {
            depositOrWithdraw(amount, "deposit");
        }
    });

    withDrawBtn.addEventListener("click", () => {
        const amount = prompt("Enter amount to withdraw");

        if (validateAmount(amount)) {
            depositOrWithdraw(amount, "withdraw");
        }
    });
}

function validateAmount(amount) {
    if (amount === "") {
        alert("Please enter an amount");
        return false;
    }
    if (isNaN(Number(amount))) {
        alert("Please enter a valid amount");
        return false;
    }
    return true;
}
