import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Host } from "./pages/Host";
import { Login } from "./pages/Login";
import { Queue } from "./pages/Queue";
import { Callback } from "./pages/Callback";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login></Login>,
  },
  {
    path: "/callback/",
    element: <Host></Host>,
  },
  {
    path: "/home/",
    element: <Host></Host>,
  },
  {
    path: "/queue/",
    element: <Queue></Queue>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RouterProvider router = {router}></RouterProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
