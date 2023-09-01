import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Loader } from "@googlemaps/js-api-loader";

function AddShopOwner({ show, onHide, refresh }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
    fetch(`${import.meta.env.VITE_API}/shops`, {
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
    })
      .then((res) => {
        if (res.status === 201) refresh() && onHide();
        else return res.json();
      })
      .then((res) => console.log(res));
  };

  return (
    <Modal show={show} onHide={onHide} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>Add a Shop Owner</Modal.Title>
      </Modal.Header>
      <div style={{ padding: "2rem" }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <input type="text" placeholder="Address" required value={address} onChange={(e) => setAddress(e.target.value)} />
        <br />
        <input type="text" placeholder="Phone Number" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <br />
        <div style={{ position: "relative", width: "100%" }}>
          <div id="map" style={{ height: "400px", width: "100%", position: "relative" }} />
          <img src="marker.png" alt="marker" style={{ position: "absolute", top: "calc(50% - 20px)", left: "calc(50% - 6px)", height: "20px" }} />
        </div>
        <button onClick={handleAdd}>Add</button>
      </div>
    </Modal>
  );
}

export default AddShopOwner;
