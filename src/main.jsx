import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import User from "./pages/User.jsx";
import SignIn from "./pages/SignIn.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/user", element: <User /> },
  { path: "/sign-in", element: <SignIn /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
