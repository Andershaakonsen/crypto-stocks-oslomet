/**
 * Script that executes in head to apply .dark class to body if "dark-mode" is set to true in localStorage or if the user has a dark theme set in their OS.
 */

const HTML = document.documentElement;

const isWindowDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const persistedDark = localStorage.getItem("dark-mode");

const actualDark =
  persistedDark === null ? isWindowDark : persistedDark === "true";

if (actualDark) {
  HTML.classList.add("dark");
}

/**
 *  Script that executes in body to toggle dark mode on click.
 * This is a separate script so that it can be loaded after the body has loaded.
 * This prevents a flash of unstyled content.
 *  */
