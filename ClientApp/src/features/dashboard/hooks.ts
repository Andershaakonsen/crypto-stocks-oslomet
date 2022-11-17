import useSWR from "swr";

export const useStocks = () => useSWR("/api/Stocks");
