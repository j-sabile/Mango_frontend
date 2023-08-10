import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" })
      .then((res) => res.json())
      .then((res) => (res.isLoggedIn ? setIsLoggedIn(true) : setIsLoggedIn(false)));
  }, []);

  const handleSignOut = async () => {
    fetch(`${import.meta.env.VITE_API}/sign-out`, { method: "POST", credentials: "include" })
      .then((res) => res.json())
      .then((res) => res.success && window.location.reload());
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Link to="/">
        <div>Mango Graham Float</div>
      </Link>

      {isLoggedIn !== null &&
        (isLoggedIn ? (
          <div>
            <Link to="/account">
              <button>Account</button>
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
