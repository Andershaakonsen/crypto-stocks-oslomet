export function animateClass(element, className, callback) {
    return new Promise((resolve, reject) => {
        element.classList.add(className);
        element.addEventListener("animationend", () => {
            element.classList.remove(className);
            if (callback) callback();
            resolve();
        });

        element.addEventListener("animationcancel", () => {
            element.classList.remove(className);
            reject(new Error("Animation cancelled for", element));
        });
    });
}
