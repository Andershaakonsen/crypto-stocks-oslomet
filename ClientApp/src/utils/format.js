const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
});

export const formatUSD = (value) => {
    return currencyFormatter.format(value);
};

export function formatCurrency(value) {
    return currencyFormatter
        .formatToParts(value)
        .filter((part) => part.type !== "currency")
        .map((part) => part.value)
        .join("");
}
