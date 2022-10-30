/**
 * Custom fetch wrapper to handle errors and return JSON
 * @param {string} url
 * @param {RequestInit} requestInit
 * @returns {Promise<
 *  {
 *    data: any;
 *    success: any;
 *    message: string;
 *    code: number;
 * }
 * >}
 */
export const wretch = async (url, requestInit) => {
    const response = await fetch(url, requestInit);

    if (!response.ok) {
        const json = parseJSON(await response.text());
        const message = json || response.statusText || response.status;
        throw new WretchError(message, response, json);
    }

    return response.json();
};

export class WretchError extends Error {
    constructor(message, response, json) {
        super(message);
        this.res = response;
        this.json = json;
        this.message = json?.message || message;
    }
}

function parseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.warn("Could not parse JSON, returning string", error);
        return jsonString;
    }
}
