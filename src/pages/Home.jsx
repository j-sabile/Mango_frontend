import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

function Home() {
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
      {api}
      {userType === "Admin" && (
        <Link to="/admin">
          <button>Admin</button>
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
    </>
  );
}

export default Home;
