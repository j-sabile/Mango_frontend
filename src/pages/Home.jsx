import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import SpinUpNotify from "../components/SpinUpNotify";

const sizes = ["Small", "Medium", "Large"];

function Home() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const [showWait, setShowWait] = useState(false);
  const [showLoaded, setShowLoaded] = useState(false);
  const [showError, setShowError] = useState(false);
  const [status, setStatus] = useState("LOADING");
  const [orderClicked, setOrderClicked] = useState(false);

  const freeAddon = [
    { name: "Nata", src: "nata.png" },
    { name: "Pearl", src: "pearl.png" },
    { name: "Fruit Jelly", src: "fruitJelly.png" },
  ];

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
        <NavBar inHome={true} />
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
      {/* OUR MENU */}
      <section id="our-menu" className="position-relative d-flex justify-content-center" style={{ background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,253,243,1) 100%)" }}>
        <div className="container d-flex flex-column align-items-center gap-4 mx-2" style={{ padding: "6rem 0rem" }}>
          <h1 className=" fw-bold tagline text-center">Our Menu</h1>
          {/* SIZES */}
          <section className="d-flex flex-column align-items-center my-4">
            <h2 className="text-center">Sizes</h2>
            <div className="d-flex gap-2 gap-sm-3 justify-content-center">
              {sizes.map((size, index) => (
                <div className="card d-flex flex-column align-items-center justify-content-end gap-1 py-2 py-sm-4 rounded-4" key={index} style={{ maxWidth: "220px", height: "100%" }}>
                  <img src="mango_cup.png" style={{ width: `${100 + (index - 2) * 12}%` }} />
                  <p className="m-0 fw-semibold text-center">{size}</p>
                </div>
              ))}
            </div>
          </section>
          {/* ADDONS */}
          <section className="d-flex flex-column align-items-center my-4">
            <h2 className="text-center">Addons</h2>
            <div className="d-flex gap-2 gap-sm-3 justify-content-center">
              {freeAddon.map((addon, index) => (
                <div key={index} className="card d-flex flex-column align-items-center justify-content-center gap-1 p-3 py-sm-5 px-sm-4 rounded-4" style={{ flex: 1, maxWidth: "220px", height: "100%" }}>
                  <img src={addon.src} alt={addon.name} style={{ width: "100%" }} />
                  <p className="m-0 fw-semibold text-center">{addon.name}</p>
                </div>
              ))}
            </div>
          </section>
          {/* BEST SELLER */}
          <div
            className="d-flex flex-column align-items-center my-5 rounded-5 shadow w-100 p-2 px-sm-5 py-4 py-sm-5"
            style={{ maxWidth: "600px", background: "linear-gradient(0deg, rgba(255,191,10,1) 0%, rgba(255,209,38,1) 100%)" }}>
            <div className="d-flex">
              <div className="flex-fill w-50 d-flex justify-content-center m-0 mx-sm-5">
                <h1 className="fw-semibold align-self-center text-white ms-3" style={{ boxSizing: "border-box", letterSpacing: "0.5px", fontSize: "3rem" }}>
                  Our <br />
                  Best <br />
                  Seller!
                </h1>
              </div>
              <div className="flex-fill w-50 d-flex flex-column align-items-center py-2 m-2 mx-sm-5">
                <img src="/mango_graham_float.png" className="" alt="mango" style={{ width: "100%", maxWidth: "200px", boxSizing: "border-box" }} />
                <h3 className="text-center text-white fw-semibold fs-4" style={{ letterSpacing: "1.25px" }}>
                  Large Nata
                </h3>
              </div>
            </div>
            <button className="btn-cncl px-5 py-2 fw-semibold rounded-pill" style={{ color: "#E0A500", fontSize: "14pt", letterSpacing: "0.5px" }}>
              Buy Now
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT US */}
      {/* <section id="contact-us" style={{ backgroundColor: "#252323" }}> */}
      <section id="contact-us" style={{ background: "linear-gradient(180deg, rgba(32,30,30,1) 0%, rgba(42,40,40,1) 100%)" }}>
        <div className="container d-flex py-5 text-white justify-content-center">
          <div className="row">
            {/* ABOUT US */}
            <div className="col-12 col-sm-4">
              <h4>About Us</h4>
              <p style={{ textAlign: "justify" }}>
                Mango Graham Float brings unique frozen treats since 2019. Our signature mango graham float layers ice cream and fruit chunks for a cool, creamy sunshine taste. Fresh, local ingredients make all flavors pop.
                Enjoy indoors or out - kids welcome too. Thanks for visiting us and spreading a little joy!
              </p>
            </div>

            {/* OUR SHOPS */}
            <div className="col-12 col-sm-4 px-5">
              <h4>Our Shops</h4>
              <li>Main Branch</li>
              <li>Dau Branch</li>
              <li>San Fernando Branch</li>
              <li>Mauaque Branch</li>
            </div>

            {/* CONTACT US */}
            <div className="col-12 col-sm-4">
              <h4>Contact Us</h4>
              <ul style={{ listStyle: "none" }}>
                <li style={{ wordBreak: "break-all" }}>mangograhamfloatph@gmail.com</li>
                <li>09563290708</li>
              </ul>
              <p className="text-center">or</p>
              <div className="d-flex">
                <input type="email" className="form-control" placeholder="Your email" />
                <button className="btn-cncl px-3 rounded-2 fw-semibold" style={{ backgroundColor: "#FFCA0A", color: "#2A2828" }}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
