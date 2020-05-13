import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCar, faMapSigns, faTimes, faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

library.add(faCar, faMapSigns, faTimes, faCopy);
toast.configure();

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
