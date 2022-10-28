export async function getListings() {
    // Fetch crypto
    const response = await fetch("/Stocks");
    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

export async function deposit(amount) {
    const response = await fetch("/api/Stocks/Deposit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.message);
    }

    return json;
}

export async function withdraw(amount) {
    const response = await fetch("/api/Stocks/Deposit", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.message);
    }

    return json;
}
