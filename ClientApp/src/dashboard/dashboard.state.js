import { Observable } from "../lib/Observable";

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
    mode: "buy",
    amount: 0,
});

/**
 * Wallet state observable
 */

export const walletState = new Observable({
    wallets: [],
    USD: null,
});
