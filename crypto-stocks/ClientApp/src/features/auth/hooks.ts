import { SWRHook } from "swr";
import { useUser } from "./AuthProvider";
import useSWR from "swr";

export const useSWRAuth = ((...args: Parameters<SWRHook>) => {
    const shouldFetch = useUser();
    const [key, ...rest] = args;
    return useSWR(shouldFetch ? key : null, ...rest);
}) as SWRHook;
