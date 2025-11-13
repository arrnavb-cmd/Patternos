import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const originalWarn = console.warn;
console.warn = function(...args) {
  const message = args[0];
  if (typeof message === 'string' && (message.includes('React Router Future Flag') || message.includes('v7_startTransition') || message.includes('v7_relativeSplatPath'))) {
    return;
  }
  originalWarn.apply(console, args);
};

createRoot(document.getElementById("root")).render(<App />);
