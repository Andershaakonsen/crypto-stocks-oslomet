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
    currency: null,
});
