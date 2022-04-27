import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SWRConfig } from "swr";
import axios from "axios";
axios.defaults.baseURL = "https://61d3e3feb4c10c001712bb0a.mockapi.io";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SWRConfig value={{
    fetcher: (url) => axios(url).then((res) => res.data)}} >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </SWRConfig>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
