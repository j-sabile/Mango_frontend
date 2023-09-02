import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Loader } from "@googlemaps/js-api-loader";

function AddShopOwner({ show, onHide, refresh }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validated, setValidated] = useState(false);
  const [map, setMap] = useState(null);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    if (document.getElementById("map")) {
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
    }
  }, [show]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setValidated(true);
    if (validateEmail() && validatePassword() && validateName() && validateAddress() && validatePhoneNumber()) {
      const res = await fetch(`${import.meta.env.VITE_API}/shops`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
          address: address,
          pinAddressLat: map.getCenter().lat(),
          pinAddressLng: map.getCenter().lng(),
          phoneNumber: phoneNumber,
          sched: [{}, {}, {}, {}, {}, {}, {}],
        }),
      });
      if (res.ok) {
        onHide();
        refresh();
        setEmail("");
        setPassword("");
        setName("");
        setAddress("");
        setPhoneNumber("");
      } else {
        const data = await res.json();
        alert(data?.error || "Error");
      }
    }
  };

  const validateEmail = () => /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+$/.test(email);
  const validatePassword = () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  const validateName = () => name.length >= 3 && name.length <= 50;
  const validateAddress = () => address.length >= 3 && address.length <= 50;
  const validatePhoneNumber = () => /^(?:0)[9]\d{9}$/.test(phoneNumber);

  return (
    <Modal show={show} onHide={onHide} centered={true} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>Add a Shop Owner</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form className="d-flex flex-column align-items-center gap-2" noValidate>
          {/* EMAIL */}
          <div className="has-validation w-100">
            <input type="email" placeholder="Email" className={`form-control ${validated ? (validateEmail() ? "is-valid" : "is-invalid") : ""}`} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="invalid-feedback">Please enter a valid email</div>
          </div>

          {/* PASSWORD */}
          <div className="has-validation w-100">
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

          {/* NAME */}
          <div className="has-validation w-100">
            <input type="text" placeholder="Name" className={`form-control ${validated ? (validateName() ? "is-valid" : "is-invalid") : ""}`} value={name} onChange={(e) => setName(e.target.value)} required />
            <div className="invalid-feedback">Too short</div>
          </div>

          {/* ADDRESS */}
          <div className="has-validation w-100">
            <input type="text" placeholder="Address" className={`form-control ${validated ? (validateAddress() ? "is-valid" : "is-invalid") : ""}`} value={address} onChange={(e) => setAddress(e.target.value)} required />
            <div className="invalid-feedback">Too short</div>
          </div>

          {/* PHONE NUMBER */}
          <div className="has-validation w-100">
            <input
              type="number"
              placeholder="Phone Number"
              className={`form-control ${validated ? (validatePhoneNumber() ? "is-valid" : "is-invalid") : ""}`}
              value={phoneNumber}
              onChange={(e) => e.target.value.length <= 11 && setPhoneNumber(e.target.value)}
              min="09000000000"
              max="09999999999"
              required
            />
            <div className="invalid-feedback">Formart should be 09XXXXXXXXX</div>
          </div>

          {/* MAP */}
          <div className="card p-3 mt-2 w-100">
            <div style={{ position: "relative", width: "100%", alignSelf: "center" }}>
              <div id="map" style={{ height: "300px", width: "100%", position: "relative" }} />
              <img src="marker.png" alt="marker" style={{ position: "absolute", top: "calc(50% - 20px)", left: "calc(50% - 6px)", height: "20px" }} />
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn-cncl px-4 py-2 rounded-3 fw-semibold" onClick={onHide}>
          Cancel
        </button>
        <button className="btn-1 px-4 py-2 rounded-3 fw-semibold" onClick={handleAdd}>
          Add
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddShopOwner;
