import "./src/style.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App";

const appRoot = document.getElementById("app")!;

// React 18 Concurrent Mode
const root = ReactDOM.createRoot(appRoot);

root.render(<App />);
