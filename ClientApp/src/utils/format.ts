/**
 * Formatting currency styles
 * @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */
const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
});

export const formatUSD = (value: number) => {
    return currencyFormatter.format(value);
};

export function formatCurrency(value: number) {
    return currencyFormatter
        .formatToParts(value)
        .filter((part) => part.type !== "currency")
        .map((part) => part.value)
        .join("");
}
