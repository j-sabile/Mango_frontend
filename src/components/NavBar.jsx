import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const account_icon = (
  <svg width="42px" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 20V19C5 16.2386 7.23858 14 10 14H14C16.7614 14 19 16.2386 19 19V20M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
      stroke="#000814"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
        } else {
          setIsLoggedIn(false);
          localStorage.clear();
        }
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
    <div style={{ backgroundColor: "#FFD60A" }}>
      <div className="container d-flex justify-content-between align-items-center py-1">
        <img src="mango_icon.png" alt="mango icon" height="60px" width="60px" tabIndex="0" onClick={() => navigate("/")} style={{ cursor: "pointer" }} onKeyDown={(e) => e.key === "Enter" && navigate("/")} />

        {isLoggedIn !== null &&
          (isLoggedIn ? (
            <div className="dropdown">
              <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {account_icon}
              </button>
              <div className="dropdown-menu">
                <button className="dropdown-item btn text-center" onClick={() => navigate("/my-account")}>
                  Account
                </button>
                <button className="dropdown-item btn text-center" onClick={() => navigate("/chat")}>
                  Chat
                </button>
                {["Customer", "Shop"].includes(userType) && (
                  <button className="dropdown-item btn text-center" onClick={() => (userType === "Customer" ? navigate("/my-orders") : userType === "Shop" ? navigate("/orders") : null)}>
                    {userType === "Customer" ? "My Orders" : userType === "Shop" ? "Orders" : null}
                  </button>
                )}
                <button className="dropdown-item btn text-center" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button className="btn px-4" style={{ backgroundColor: "#F3F3F3", fontWeight: "500" }} onClick={() => navigate("/sign-in")}>
              Sign In
            </button>
          ))}
      </div>
    </div>
  );
}
export default NavBar;
