import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        if (res.isLoggedIn) {
          setIsLoggedIn(true);
          localStorage.setItem("userId", res.userId);
          localStorage.setItem("userType", res.userType);
          setUserType(res.userType);
        } else setIsLoggedIn(false);
      });
  }, []);

  const handleSignOut = async () => {
    fetch(`${import.meta.env.VITE_API}/sign-out`, {
      method: "POST",
      credentials: "include",
    }).then((res) => {
      if (res.status === 200) {
        navigate("/");
        window.location.reload();
      }
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Link to="/">
        <div>Mango Graham Float</div>
      </Link>

      {isLoggedIn !== null &&
        (isLoggedIn ? (
          <div>
            {userType === "Customer" && (
              <Link to="/my-orders">
                <button>My Orders</button>
              </Link>
            )}
            {userType === "Shop" && (
              <Link to="/orders">
                <button>Orders</button>
              </Link>
            )}
            <Link to="/chat">
              <button>Chat</button>
            </Link>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <Link to="/sign-in">
            <button>Sign In</button>
          </Link>
        ))}
    </div>
  );
}
export default NavBar;
