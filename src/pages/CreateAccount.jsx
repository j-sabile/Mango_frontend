import NavBar from "../components/NavBar";
import { useEffect, useState, Fragment } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

function CreateAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [map, setMap] = useState(null);
  const [logInMessage, setLogInMessage] = useState("");
  const [showCreateAccountSuccess, setShowCreateAccountSuccess] = useState(false);
  const [validated, setValidated] = useState(false);
  const [createAccountLoading, setCreateAccountLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.isLoggedIn) navigate("/");
      else setLoading(false);
      const loader = new Loader({ apiKey: import.meta.env.VITE_MAPS_API, version: "weekly" });
      loader.importLibrary("maps").then(() => {
        const map = new window.google.maps.Map(document.getElementById("map"), {
          center: { lat: 15.2082, lng: 120.6088 },
          zoom: 13,
          mapTypeControlOptions: { mapTypeIds: [] },
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
        });
        setMap(map);
      });
    };
    init();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setCreateAccountLoading(true);
    setValidated(true);
    if (validateEmail() && validatePassword() && validateFirstName() && validateLastName && validateAddress() && validatePhoneNumber()) {
      await fetch(`${import.meta.env.VITE_API}/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          address: address,
          pinAddressLat: map.getCenter().lat(),
          pinAddressLng: map.getCenter().lng(),
          phoneNumber: phoneNumber,
        }),
      }).then((res) => {
        if (res.status === 201) setShowCreateAccountSuccess(true);
        else if (res.status === 400) res.json().then((error) => setLogInMessage(error.error));
      });
    }
    setCreateAccountLoading(false);
  };

  const validateEmail = () => /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+$/.test(email);
  const validatePassword = () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  const validateFirstName = () => firstName.length >= 3 && firstName.length <= 50;
  const validateLastName = () => lastName.length >= 3 && lastName.length <= 50;
  const validateAddress = () => address.length >= 10 && address.length <= 200;
  const validatePhoneNumber = () => /^(?:0)[9]\d{9}$/.test(phoneNumber);

  if (loading) return;

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <NavBar />
      <section className="d-flex flex-column justify-content-center flex-fill px-3" style={{ background: "radial-gradient(circle, rgba(252,250,238,1) 35%, rgba(240,229,168,1) 100%)" }}>
        <div className="card d-flex flex-column py-5 px-3 p-sm-5 border-0 rounded-5 gap-4 m-4 align-self-center" style={{ width: "100%", maxWidth: "600px", boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }}>
          <h2 className="align-self-center">Create Account</h2>
          <form className={`d-flex flex-column align-items-center `} noValidate>
            <div className="row g-3">
              {/* EMAIL */}
              <div className="col-sm-6 col-12 my-1">
                <input type="email" placeholder="Email" className={`form-control ${validated ? (validateEmail() ? "is-valid" : "is-invalid") : ""}`} value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div className="invalid-feedback">Please enter a valid email</div>
              </div>

              {/* PASSWORD */}
              <div className="col-sm-6 col-12 my-1">
                <input
                  type="password"
                  placeholder="Password"
                  className={`form-control ${validated ? (validatePassword() ? "is-valid" : "is-invalid") : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="invalid-feedback">Include an uppercase, lowercase, and number</div>
              </div>

              {/* FIRST NAME */}
              <div className="col-sm-6 col-12 my-1">
                <input
                  type="text"
                  placeholder="First Name"
                  className={`form-control ${validated ? (validateFirstName() ? "is-valid" : "is-invalid") : ""}`}
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <div className="invalid-feedback">Too short</div>
              </div>

              {/* LAST NAME */}
              <div className="col-sm-6 col-12 my-1">
                <input
                  type="text"
                  placeholder="Last Name"
                  className={`form-control ${validated ? (validateLastName() ? "is-valid" : "is-invalid") : ""}`}
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <div className="invalid-feedback">Too short</div>
              </div>

              {/* ADDRESS */}
              <div className="col-12 my-1">
                <input type="text" placeholder="Address" className={`form-control ${validated ? (validateAddress() ? "is-valid" : "is-invalid") : ""}`} required value={address} onChange={(e) => setAddress(e.target.value)} />
                <div className="invalid-feedback">Too short</div>
              </div>

              {/* PHONE NUMBER */}
              <div className="col-12 my-1">
                <input
                  type="number"
                  placeholder="Phone Number"
                  className={`form-control ${validated ? (validatePhoneNumber() ? "is-valid" : "is-invalid") : ""}`}
                  required
                  value={phoneNumber}
                  onChange={(e) => e.target.value.length <= 11 && setPhoneNumber(e.target.value)}
                />
                <div className="invalid-feedback">Formart should be 09XXXXXXXXX</div>
              </div>
            </div>

            {/* MAP */}
            <div className="card p-3 mt-2 w-100">
              <div style={{ position: "relative", width: "100%", alignSelf: "center" }}>
                <div id="map" style={{ height: "300px", width: "100%", position: "relative" }} />
                <img src="marker.png" alt="marker" style={{ position: "absolute", top: "calc(50% - 20px)", left: "calc(50% - 6px)", height: "20px" }} />
              </div>
            </div>

            {/* CREATE ACCOUNT BTN */}
            <button type="submit" className="btn-1 px-5 py-2 mt-3 rounded-4 fw-semibold" onClick={handleCreateAccount} disabled={createAccountLoading}>
              {createAccountLoading ? (
                <Fragment>
                  <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                  <span role="status">Creating Account...</span>
                </Fragment>
              ) : (
                <Fragment>Create Account</Fragment>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* CREATE ACCOUNT SUCCESS */}
      <Modal show={showCreateAccountSuccess} centered={true}>
        <div className="d-flex flex-column align-items-center gap-3 p-5">
          <h4 className="text-center">Successfully created account.</h4>
          <div style={{ alignSelf: "center" }}>
            <button className="btn-1 rounded-4 fw-semibold px-5 py-2" onClick={() => navigate("/")}>
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CreateAccount;
