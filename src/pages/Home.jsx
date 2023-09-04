import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import SpinUpNotify from "../components/SpinUpNotify";

function Home() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  const handleOrderNow = () => {
    console.log(userType);
    if (userType === "Customer") navigate("/create-order");
    else if (userType === null) navigate("/sign-in");
  };

  return (
    <>
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <NavBar />
        <section className="d-flex flex-column justify-content-center flex-fill px-3" style={{ background: "radial-gradient(circle, rgba(252,250,238,1) 35%, rgba(240,229,168,1) 100%)" }}>
          <div className="container d-flex justify-content-between align-items-center">
            <div className="d-flex flex-column justify-content-center align-items-start">
              <p className="myFont fw-semibold tagline w-100" style={{ color: "#000814" }}>
                Fresh Pure Mangoes <br />
                No Artificial Color <br />
                No Artificial Flavor
              </p>
              <button className="btn-1 myFont rounded-4 myFont px-5 py-2 fs-5 fw-semibold" onClick={handleOrderNow}>
                Order Now
              </button>
            </div>
            <div>
              <img src="/mango_graham_float.png" className="px-5 img-none" alt="mango" style={{ width: "100%", maxWidth: "400px" }} />
            </div>
          </div>
        </section>
        <SpinUpNotify />
      </div>
    </>
  );
}

export default Home;
