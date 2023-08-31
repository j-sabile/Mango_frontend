import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

function CreateAccount() {
  const navigate = useNavigate();
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

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_MAPS_API,
      version: "weekly",
    });

    loader.importLibrary("maps").then(() => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 15.2082, lng: 120.6088 },
        zoom: 15,
        mapTypeControlOptions: { mapTypeIds: [] },
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
      });
      setMap(map);
    });
  }, []);

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) {
      setValidated(true);
      fetch(`${import.meta.env.VITE_API}/sign-up`, {
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
    } else {
      setValidated(true);
    }
  };

  return (
    <>
      <NavBar />
      <section className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="d-flex flex-column gap-5 py-4" style={{ width: "600px" }}>
          <h2 className="align-self-center">Create Account</h2>
          {/* <form className="row g-2 needs-validation "  noValidate> */}
          <form className={`row g-3 ${validated ? "was-validated" : ""}`} noValidate>
            <div className="col-sm-6 col-12 my-1">
              <input type="email" placeholder="Email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="col-sm-6 col-12 my-1">
              <input type="password" placeholder="Password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="col-sm-6 col-12 my-1">
              <input type="text" placeholder="First Name" className="form-control" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              {firstName.length < 3 && <div className="invalid-feedback">First name must be at least 3 characters long.</div>}
            </div>
            <div className="col-sm-6 col-12 my-1">
              <input type="text" placeholder="Last Name" className="form-control" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="col-12 my-1">
              <input type="text" placeholder="Address" className="form-control" required value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="col-12 my-1">
              <input type="number" placeholder="Phone Number (09XXXXXXXXX)" className="form-control" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div className="card p-3 mt-3">
              <div style={{ position: "relative", width: "100%", alignSelf: "center" }}>
                <div id="map" style={{ height: "300px", width: "100%", position: "relative" }} />
                <img src="https://www.nicepng.com/png/detail/295-2955914_red-marker-on-map.png" alt="Marker" style={{ position: "absolute", top: "calc(50% - 20px)", left: "calc(50% - 12px)", height: "20px" }} />
              </div>
            </div>
            <button type="submit" onClick={handleCreateAccount} className="btn py-2" style={{ backgroundColor: "#FFD60A", color: "#001D3D", fontWeight: "600", fontSize: "14pt" }}>
              Create Account
            </button>
          </form>
        </div>
      </section>

      <Modal show={showCreateAccountSuccess} centered={true}>
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <h4>Successfully created account.</h4>
          <div style={{ alignSelf: "center" }}>
            <button onClick={() => navigate("/")}>Continue</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateAccount;
