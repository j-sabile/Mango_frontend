import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
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
