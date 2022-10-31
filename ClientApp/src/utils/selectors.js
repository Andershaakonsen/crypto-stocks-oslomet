/**
 * Gets an element from the DOM by its data-js attribute.
 */
export const getByDataJS = (dataJs) => {
    const element = document.querySelector(`[data-js="${dataJs}"]`);
    if (!element) throw new Error(`No element found with data-js="${dataJs}"`);
    return element;
};

/**
 * Gets all elements from the DOM by their data-js attribute.
 */
export const getAllByDataJS = (dataJs) => {
    const elements = document.querySelectorAll(`[data-js="${dataJs}"]`);
    if (!elements.length)
        throw new Error(`No elements found with data-js="${dataJs}"`);
    return Array.from(elements);
};
