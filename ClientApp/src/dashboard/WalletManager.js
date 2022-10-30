import { formatCurrency, Toast, getByDataJS } from "../utils";
import * as API from "../api";
import { walletState } from "../state";

const depositBtn = getByDataJS("deposit-btn");
const withDrawBtn = getByDataJS("withdraw-btn");
const walletList = getByDataJS("wallet-list");

export async function updateWallets() {
    const wallets = await API.getWallets();

    const usdWallet = wallets.find((w) => w.symbol === "USD");
    // Update the balance
    walletState.set((s) => ({ ...s, wallets, USD: usdWallet }));
}

updateWallets();

walletState.subscribe(({ wallets }) => {
    walletList.innerHTML = wallets
        .map(
            (wallet) => /*html*/ `
        <li class="flex items-center justify-between">
            <span>
                ${wallet.symbol}
            </span>
            <span class="font-medium">${formatCurrency(wallet.balance)}</span>
        </li>
    `
        )
        .join("");
});

export default function WalletManager() {
    /**
     * Event listeners
     */
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

/**
 * DEPOSITS
 */

function validateAmount(amt) {
    const amount = amt.trim();
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

const depositOrWithdraw = async (amount, type) => {
    try {
        const response =
            type === "deposit"
                ? await API.deposit(amount)
                : await API.withdraw(amount);

        Toast.success(response.message);
        // Update the balance
        updateWallets();
    } catch (error) {
        console.error({
            ...error,
        });
        Toast.error(
            `Could not complete ${type} request. Error: ${error.message}`
        );
    }
};
