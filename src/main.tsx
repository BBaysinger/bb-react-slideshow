import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.scss";
import App from "./App";

// Initialize the React application by targeting the HTML element with ID "root"
// The `!` asserts that the element exists and is not `null` at runtime.
createRoot(document.getElementById("root")!).render(
  // Wrap the App component in React's StrictMode to enable additional checks
  // and warnings during development for improved code quality and error detection.
  <StrictMode>
    <App />
  </StrictMode>,
);
