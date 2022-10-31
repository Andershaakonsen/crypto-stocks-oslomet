import { Observable } from "./utils";

/**
 * Dashboard State observable
 */
export const dashboardState = new Observable({
    listings: [],
    selected: null,
    user: {},
});

/**
 * Order form state observable
 */
export const orderState = new Observable({
    currency: "USDT",
    amount: 0,
});

export const orderListState = new Observable([]);

/**
 * Wallet state observable
 */

export const walletState = new Observable({
    wallets: [],
    USD: null,
});
