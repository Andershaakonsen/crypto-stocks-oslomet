import { Observable } from "./lib/Observable";

const HTML = document.documentElement;

export const createDarkMode = (targetElement) => {
  const darkState = new Observable(false);

  const isWindowDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const persistedDark = localStorage.getItem("dark-mode");

  const actualDark =
    persistedDark === null ? isWindowDark : persistedDark === "true";

  darkState.set(actualDark);

  darkState.subscribe((isDark) => {
    isDark ? HTML.classList.add("dark") : HTML.classList.remove("dark");
    localStorage.setItem("dark-mode", isDark);
  });

  const handler = () => {
    darkState.set(!darkState.value);
  };

  targetElement.addEventListener("click", handler);

  return darkState;
};
