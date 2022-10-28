import { Observable } from "./Observable";

const HTML = document.documentElement;

const createDarkMode = (targetElement) => {
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

  return {
    state: darkState,
    unsubscribe: () => targetElement.removeEventListener("click", handler),
  };
};

export function initDarkMode() {
  /**
   * Dark mode toggle
   */
  const darkToggle = document.getElementById("dark-mode-toggle");
  const { state: darkState } = createDarkMode(darkToggle);

  // Subscribe to the dark mode state and update the toggle icon
  darkState.subscribe((isDark) => {
    darkToggle.innerHTML = /*html*/ `<i class="gg-${
      isDark ? "sun" : "moon"
    }"></i>`;
  });
}
