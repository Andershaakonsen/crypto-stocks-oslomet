export function readFromStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export function writeToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
