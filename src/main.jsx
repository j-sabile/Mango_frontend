import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import User from "./pages/User.jsx";
import SignIn from "./pages/SignIn.jsx";
import CreateAccount from "./pages/CreateAccount";
import HomeAdmin from "./pages/Admin/Home_admin";
import CreateOrder from "./pages/Customer/CreateOrder_customer";
import "bootstrap/dist/css/bootstrap.min.css";
import HomeShop from "./pages/Shop/Home_shop";
import Chat from "./pages/Chat";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },

  { path: "/user", element: <User /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/create-account", element: <CreateAccount /> },

  // admin
  { path: "/admin", element: <HomeAdmin /> },

  // shop
  { path: "/shop", element: <HomeShop /> },

  // customer
  { path: "/create-order", element: <CreateOrder /> },

  { path: "/chat", element: <Chat /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
