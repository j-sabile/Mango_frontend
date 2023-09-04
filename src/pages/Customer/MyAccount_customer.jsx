import { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import NavBar from "../../components/NavBar";
import NotFound from "../NotFound";

function MyAccountCustomer() {
  const [myAccount, setMyAccount] = useState("LOADING");

  useEffect(() => {
    loadMyAccount();
  }, []);

  const loadMyAccount = async () => {
    const res = await fetch(`${import.meta.env.VITE_API}/my-account`, { method: "GET", credentials: "include" });
    if (!res.ok) setMyAccount(null);
    const { request: data } = await res.json();
    setMyAccount(data);
    const loader = new Loader({ apiKey: import.meta.env.VITE_MAPS_API, version: "weekly" });
    loader.importLibrary("maps").then(() => {
      new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: data.pin_address_lat, lng: data.pin_address_lng },
        zoom: 13,
        mapTypeControlOptions: { mapTypeIds: [] },
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        gestureHandling: "none",
      });
    });
  };

  if (myAccount === null) return <NotFound />;

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <NavBar />
      <section className="d-flex justify-content-center px-2 py-3 p-sm-5 flex-fill" style={{ background: "radial-gradient(circle, rgba(252,250,238,1) 35%, rgba(240,229,168,1) 100%)" }}>
        <div className="d-flex flex-column" style={{ width: "700px" }}>
          {/* HEADER */}
          <h1 className="fw-normal m-0 mx-4">My Account</h1>
          <hr className="my-2" />

          {/* ACCOUNT INFO */}
          <div className="d-flex flex-column gap-3 p-2 p-sm-4">
            <div className="card rounded-4 p-4 px-sm-5 border-0" style={{ boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }}>
              {/* BASIC INFO */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "5px" }}>
                <div className="fw-semibold me-2">Name:</div>
                <div>{`${myAccount?.first_name} ${myAccount.last_name}`}</div>
                <div className="fw-semibold me-2">Email:</div>
                <div style={{ wordWrap: "break-word", maxWidth: "100%" }}>{myAccount?.email}</div>
                <div className="fw-semibold me-2">Phone Number:</div>
                <div>{myAccount?.phone_number}</div>
                <div className="fw-semibold me-2">Address:</div>
                <div>{myAccount?.address}</div>
                <div className="fw-semibold me-2">Pin Address:</div>
                <div>{myAccount?.pin_address}</div>
              </div>
              <hr />

              {/* MAP */}
              <div className="card p-3 mt-2 w-100">
                <div style={{ position: "relative", width: "100%", alignSelf: "center" }}>
                  <div id="map" style={{ height: "300px", width: "100%", position: "relative" }} />
                  <img src="marker.png" alt="marker" style={{ position: "absolute", top: "calc(50% - 20px)", left: "calc(50% - 6px)", height: "20px" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MyAccountCustomer;
