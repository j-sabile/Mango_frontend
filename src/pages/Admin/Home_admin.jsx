import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import ShopOwner from "./ShopOwner/ShopOwner_admin";

function HomeAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" })
      .then((res) => res.json())
      .then((res) => !(res.isLoggedIn && res.userType === "Admin") && navigate("/"));
  }, []);

  return (
    <>
      <NavBar />
      <h2>Admin Homepage</h2>
      <ShopOwner />
    </>
  );
}

export default HomeAdmin;
