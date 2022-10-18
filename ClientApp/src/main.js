import "./style.scss";
import { createDarkMode } from "./dark-mode";

/**
 * Dark mode toggle
 */
const darkToggle = document.getElementById("dark-mode-toggle");
const darkState = createDarkMode(darkToggle);

// Subscribe to the dark mode state and update the toggle icon
darkState.subscribe((isDark) => {
  darkToggle.innerHTML = /*html*/ `<i class="gg-${
    isDark ? "sun" : "moon"
  }"></i>`;
});
