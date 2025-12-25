import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { SepetProvider } from "./context/SepetContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <SepetProvider>
                <App />
            </SepetProvider>
        </AuthProvider>
    </React.StrictMode>
);
