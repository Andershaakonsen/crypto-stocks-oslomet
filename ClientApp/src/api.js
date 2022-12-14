import { wretch } from "./utils";

export async function getListings() {
    // Fetch crypto
    const json = await wretch("/api/Stocks");
    return json.data;
}

const USER_ID = 1; //! Hardcoded for now

export async function deposit(amount) {
    const response = await wretch("/api/Wallets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, userId: USER_ID }),
    });

    return response;
}

export async function withdraw(amount) {
    const response = await wretch("/api/Wallets", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, userId: USER_ID }),
    });

    return response;
}

export async function getWallets() {
    const json = await wretch(`/api/Wallets?userId=${USER_ID}`);
    return json.data;
}

export async function createBuyOrder({ units, currency }) {
    const response = await wretch("/api/Stocks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            units,
            symbol: currency.symbol,
            userId: USER_ID,
        }),
    });
    return response;
}

export async function updateOrder(orderId, partialBuyOrder) {
    const response = await wretch(`/api/Stocks/${orderId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(partialBuyOrder),
    });
    return response;
}

export async function sellOrder(orderId) {
    const response = await wretch(`/api/Stocks/${orderId}`, {
        method: "DELETE",
    });
    return response;
}

export async function getOrders({ limit = 10 } = {}) {
    const json = await wretch(
        `/api/Stocks/transactions?userId=${USER_ID}&limit=${limit}`
    );
    return json.data;
}
