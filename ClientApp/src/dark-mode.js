const HTML = document.documentElement;

export const createDarkMode = (targetElement) => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isPersistedDark = localStorage.getItem("dark-mode") === "true";

  if (isDark || isPersistedDark) {
    HTML.classList.add("dark");
  }

  const handler = () => {
    HTML.classList.toggle("dark");
    localStorage.setItem("dark-mode", HTML.classList.contains("dark"));
  };

  targetElement.addEventListener("click", handler);

  return () => {
    targetElement.removeEventListener("click", handler);
  };
};
