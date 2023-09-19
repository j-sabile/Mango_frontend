import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ inHome }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userType, setUserType] = useState(null);
  const [accountClicked, setAccountClicked] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);
  const checkIfLoggedIn = async () => {
    const res = await fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    if (data.isLoggedIn) {
      setIsLoggedIn(true);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userType", data.userType);
      setUserType(data.userType);
    } else {
      setIsLoggedIn(false);
      localStorage.clear();
    }

    //         if (res.isLoggedIn) {
    //           setIsLoggedIn(true);
    //           localStorage.setItem("userId", res.userId);
    //           localStorage.setItem("userType", res.userType);
    //           setUserType(res.userType);
    //         } else {
    //           setIsLoggedIn(false);
    //           localStorage.clear();
  };
  const handleSignOut = async () => {
    setSignOutLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API}/sign-out`, { method: "POST", credentials: "include" });
    if (res.status === 200) {
      navigate("/");
      window.location.reload();
    }
    setSignOutLoading(false);
  };

  return (
    <div className="position-relative">
      <nav className="bg-1 p-1">
        <div className="container d-flex justify-content-between align-items-center">
          <img src="/mango_icon.png" alt="mango icon" height="60px" width="60px" tabIndex="0" onClick={() => navigate("/")} style={{ cursor: "pointer" }} onKeyDown={(e) => e.key === "Enter" && navigate("/")} />
          <ul style={{ listStyle: "none" }} className="d-flex gap-2 m-0 align-items-center">
            {inHome && (
              <Fragment>
                <li className="fs-6 ptr fw-semibold d-none d-sm-block">
                  <a href="create-order" className="nav-rmv-a">
                    Order Now
                  </a>
                </li>
                <li className="fs-6 ptr fw-semibold d-none d-sm-block">
                  <a href="#our-menu" className="nav-rmv-a">
                    Our Menu
                  </a>
                </li>
                <li className="fs-6 ptr fw-semibold d-none d-sm-block">
                  <a href="#contact-us" className="nav-rmv-a">
                    Contact Us
                  </a>
                </li>
              </Fragment>
            )}
            {isLoggedIn === false && (
              <button className="btn-wht myFont px-4 py-2 rounded-3 fw-semibold ms-4" onClick={() => navigate("/sign-in")}>
                Sign In
              </button>
            )}
            {isLoggedIn === true && (
              <div className="ptr rounded-pill bg-white p-2 shadow ms-4" onClick={() => setAccountClicked(!accountClicked)}>
                {account_icon}
              </div>
            )}
          </ul>
        </div>
      </nav>
      {accountClicked && (
        <div className="container d-flex justify-content-end">
          <div className="position-absolute shadow bg-white rounded-3 d-flex flex-column px-2 py-1 mt-2 z-1">
            <button className="text-center py-2 px-4 btn-drpdwn rounded-3" onClick={() => navigate("/my-account")}>
              Account
            </button>
            {["Customer", "Shop"].includes(userType) && (
              <button className="text-center py-2 px-4 btn-drpdwn rounded-3" onClick={() => (userType === "Customer" ? navigate("/my-orders") : userType === "Shop" ? navigate("/orders") : null)}>
                {userType === "Customer" ? "My Orders" : userType === "Shop" ? "Orders" : null}
              </button>
            )}
            <button className="text-center py-2 px-4 btn-drpdwn rounded-3" onClick={() => navigate("/chat")}>
              Chats
            </button>
            <button className="text-center py-2 px-4 btn-drpdwn rounded-3" onClick={handleSignOut} disabled={signOutLoading}>
              {signOutLoading ? (
                <Fragment>
                  <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                  <span role="status">Signing Out...</span>
                </Fragment>
              ) : (
                <Fragment>Sign Out</Fragment>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;

const account_icon = (
  <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 20V19C5 16.2386 7.23858 14 10 14H14C16.7614 14 19 16.2386 19 19V20M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
      stroke="#000814"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
