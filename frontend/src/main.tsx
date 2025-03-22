import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import store from "./store/store";
import "./assets/styles/global.scss"
import App from "./App.tsx";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
