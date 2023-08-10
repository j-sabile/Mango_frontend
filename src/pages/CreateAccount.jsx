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
  const [lat, setLat] = useState(15.2082);
  const [lng, setLng] = useState(120.6088);
  const [map, setMap] = useState(null);
  const [logInMessage, setLogInMessage] = useState("");
  const [showCreateAccountSuccess, setShowCreateAccountSuccess] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_MAPS_API,
      version: "weekly",
    });

    loader.importLibrary("maps").then(() => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng },
        zoom: 15,
      });
      setMap(map);
    });
  }, []);

  const handleCreateAccount = (e) => {
    e.preventDefault();
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
  };

  return (
    <>
      <NavBar />
      <h3>Create Account</h3>
      <form>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <br />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <input type="number" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        <br />
        <div style={{ position: "relative", width: "500px" }}>
          <div id="map" style={{ height: "400px", width: "100%", position: "relative" }} />
          <img
            src="https://www.nicepng.com/png/detail/295-2955914_red-marker-on-map.png"
            alt="Marker"
            style={{ position: "absolute", top: "calc(50% - 20px)", left: "calc(50% - 12px)", height: "20px" }}
          />
        </div>
        <p>{logInMessage}</p>
        <button type="submit" onClick={handleCreateAccount}>
          Create Account
        </button>
      </form>
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
