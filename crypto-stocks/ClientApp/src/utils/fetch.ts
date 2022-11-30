import { FetchOptions, ofetch } from "ofetch";

export const authFetch = ofetch.create({
    onRequest(context) {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            context.options.headers = context.options.headers || {};
            const headers = context.options.headers;
            if (headers instanceof Headers) {
                headers.append("Authorization", `Bearer ${accessToken}`);
            } else if (Array.isArray(headers)) {
                headers.push(["Authorization", `Bearer ${accessToken}`]);
            } else {
                headers.Authorization = `Bearer ${accessToken}`;
            }
        }
    },
});

// Create a global fetcher for SWR using ofetch library (modified fetch wrapper)
interface OfetchInit extends FetchOptions {
    url: string;
}

export const swrFetcher = (
    url: string | OfetchInit | [string, FetchOptions]
) => {
    return (
        typeof url === "string"
            ? authFetch(url)
            : Array.isArray(url)
            ? authFetch(url[0], {
                  ...url[1],
              })
            : authFetch(url.url, {
                  ...url,
              })
    ).then((r) => r);
};
