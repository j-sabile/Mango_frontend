import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyAccountAdmin from "./Admin/MyAccount_admin";
import MyAccountCustomer from "./Customer/MyAccount_customer";
import MyAccountShop from "./Shop/MyAccount_shop";

function MyAccount() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!data.isLoggedIn) navigate("/");
      setUserType(data.userType);
    };
    init();
  }, []);

  if (userType === "Customer") return <MyAccountCustomer />;
  else if (userType === "Shop") return <MyAccountShop />;
  else if (userType === "Admin") return <MyAccountAdmin />;
}

export default MyAccount;
