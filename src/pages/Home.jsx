import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Shops from "../components/Shops";

function Home() {
  const navigate = useNavigate();
  const [api, setApi] = useState("Loading...");
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}`)
      .then((res) => res.json())
      .then((res) => setApi(res.message));

    fetch(`${import.meta.env.VITE_API}/is-logged-in`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => res.isLoggedIn && setUserType(res.userType));
  }, []);

  useEffect(() => {
    if (userType !== null) console.log("User Type: ", userType);
  }, [userType]);

  return (
    <>
      <NavBar />
      <section className="d-flex justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column justify-content-center align-items-start">
            <p style={{ fontSize: "36pt", fontWeight: "600", color: "#000814" }}>Fresh Mangoes</p>
            <button className="btn" style={{ backgroundColor: "#FFC300", color: "#F3F3F3", fontWeight: "500", padding: "0.5rem 2rem", fontSize: "16pt" }} onClick={() => navigate("/create-order")}>
              Order Now
            </button>
          </div>
          <div className="">
            <img src="https://img.freepik.com/free-vector/yellow-mango-with-leaf-cartoon-sticker_1308-92449.jpg?w=2000" height="350" alt="mango" />
          </div>
        </div>
      </section>

      {/* {api}
      {userType === "Admin" && (
        <Link to="/admin">
          <button>Admin</button>
        </Link>
      )}
      {userType === "Shop" && (
        <Link to="/shop">
          <button>Shop</button>
        </Link>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          <div>
            <h5>Fresh Mangoes</h5>
            <Link to="create-order">
              <button>Order Now</button>
            </Link>
          </div>
          <img src="https://img.freepik.com/free-vector/yellow-mango-with-leaf-cartoon-sticker_1308-92449.jpg?w=2000" height="150" alt="mango" />
        </div>
      </div>
      <Shops /> */}
    </>
  );
}

export default Home;
