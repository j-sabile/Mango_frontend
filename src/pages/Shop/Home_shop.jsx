import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Shop from "./Shop_shop";

function HomeShop() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" })
      .then((res) => res.json())
      .then((res) => !(res.isLoggedIn && res.userType === "Shop") && navigate("/"));
  }, []);
  return (
    <>
      <NavBar />
      <h2>Shop Homepage</h2>
      <Shop />
    </>
  );
}

export default HomeShop;
