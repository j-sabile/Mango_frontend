import { useState, useEffect, Fragment } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import NavBar from "../../components/NavBar";
import EditMyAccountModal from "../../components/Modals/Shop/EditMyAccountModal";
import NotFound from "../NotFound";

const stocksModel = [
  ["Small", "stock_small"],
  ["Nata", "stock_nata"],
  ["Medium", "stock_medium"],
  ["Pearl", "stock_pearl"],
  ["Large", "stock_large"],
  ["Fruit Jelly", "stock_fruitjelly"],
];
function MyAccountShop() {
  const [myAccount, setMyAccount] = useState("LOADING");
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    loadMyAccount();
  }, []);

  const loadMyAccount = async () => {
    const res = await fetch(`${import.meta.env.VITE_API}/my-account`, { method: "GET", credentials: "include" });
    if (!res.ok) return setMyAccount(null);
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
          <div className="d-flex justify-content-between align-items-center px-4">
            <h1 className="fw-normal m-0">My Account</h1>
            <button className="btn-cncl px-4 py-2 rounded-3" onClick={() => setShowEdit(true)}>
              Edit
            </button>
          </div>
          <hr className="my-2" />

          {/* ACCOUNT INFO */}
          <div className="d-flex flex-column gap-3 p-2 p-sm-4">
            <div className="card rounded-4 p-4 px-sm-5 border-0" style={{ boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }}>
              {/* BASIC INFO */}
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "5px" }}>
                <div className="fw-semibold me-2">Name:</div>
                <div>{myAccount?.name}</div>
                <div className="fw-semibold me-2">Email:</div>
                <div>{myAccount?.email}</div>
                <div className="fw-semibold me-2">Phone Number:</div>
                <div>{myAccount?.phone_number}</div>
                <div className="fw-semibold me-2">Address:</div>
                <div>{myAccount?.address}</div>
                <div className="fw-semibold me-2">Pin Address:</div>
                <div>{myAccount?.pin_address}</div>
              </div>
              <hr className="my-4" />

              {/* SHOP STATUS */}
              <div className="d-flex flex-column gap-3">
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "5px" }}>
                  <div className="fw-semibold me-2">Status:</div>
                  <div>{myAccount?.force_open ? "Open" : "Closed"}</div>
                </div>
                <div className="px-2" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto 1fr", gap: "5px" }}>
                  {stocksModel.map((stock, index) => (
                    <Fragment key={index}>
                      <div className="d-flex align-items-center">
                        <h6 className="m-0 me-1">{`${stock[0]}:`}</h6>
                      </div>
                      <div>{myAccount?.[stock[1]] || 0}</div>
                      {/* <input type="number" className="form-control" placeholder={stock[0]} value={myAccount?.[stock[1]] || 0} min="0" max="999" disabled /> */}
                    </Fragment>
                  ))}
                </div>
              </div>
              <hr className="my-4" />

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
      <EditMyAccountModal show={showEdit} shop={myAccount} onHide={() => setShowEdit(false)} refresh={loadMyAccount} />
    </div>
  );
}

export default MyAccountShop;
