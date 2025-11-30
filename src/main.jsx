import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// 🔥 Відновлення шляху після редіректу GitHub Pages
const redirect = sessionStorage.redirect;
if (redirect) {
  sessionStorage.removeItem("redirect");
  window.history.replaceState(null, "", redirect);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);
