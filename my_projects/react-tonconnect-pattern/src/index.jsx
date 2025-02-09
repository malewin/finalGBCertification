import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import "./index.css";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <React.StrictMode>
      <TonConnectUIProvider
        manifestUrl={"https://informer.ton.sc/manifest_ton.json"}
        language="en"
        uiPreferences={{ theme: "LIGHT" }}
      >
        <App />
      </TonConnectUIProvider>
    </React.StrictMode>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
