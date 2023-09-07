import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import SpinUpNotify from "../components/SpinUpNotify";

function Home() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [showWait, setShowWait] = useState(false);
  const [showLoaded, setShowLoaded] = useState(false);
  const [showError, setShowError] = useState(false);
  const [status, setStatus] = useState("LOADING");
  const [orderClicked, setOrderClicked] = useState(false);

  useEffect(() => {
    const init = async () => {
      let showNoResponse = false;
      const handleNoResponse = () => {
        setStatus("WAITING");
        setShowWait(true);
        showNoResponse = true;
      };
      const handleResponseReceived = () => {
        setStatus("RECEIVED");
        setShowWait(false);
        setShowLoaded(true);
      };
      let timer = setTimeout(() => handleNoResponse(), 2000);
      const res = await fetch(`${import.meta.env.VITE_API}/`);
      clearTimeout(timer);
      if (res.ok && showNoResponse) handleResponseReceived();
      else if (res.ok) setStatus("RECEIVED");
      else !res.ok && setShowError(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (status === "WAITING" && orderClicked) {
      setShowWait(true);
      setOrderClicked(false);
    }
  }, [status, orderClicked]);

  const handleOrderNow = () => {
    setOrderClicked(true);
    if (status !== "LOADING" && status !== "WAITING") {
      if (userType === "Customer") navigate("/create-order");
      else if (userType === null) navigate("/sign-in");
    }
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
        <SpinUpNotify show={{ showWait, showLoaded, showError }} onHide={{ setShowWait, setShowLoaded, setShowError }} />
      </div>
    </>
  );
}

export default Home;
