import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import { Loader } from "@googlemaps/js-api-loader";

const stocksModel = [
  ["Nata", "stock_nata"],
  ["Pearl", "stock_pearl"],
  ["Fruit Jelly", "stock_fruitjelly"],
  ["Small", "stock_small"],
  ["Medium", "stock_medium"],
  ["Large", "stock_large"],
];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"];

function EditShopOwner({ show, onHide, refresh, shopId }) {
  const [shop, setShop] = useState(null);
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState("");
  const [forceOpen, setForceOpen] = useState(false);
  const [stocks, setStocks] = useState({});
  const [sched, setSched] = useState([{}, {}, {}, {}, {}, {}, {}]);

  useEffect(() => {
    if (show)
      fetch(`${import.meta.env.VITE_API}/shops/${shopId}`, { credentials: "include" })
        .then((res) => res.status === 200 && res.json())
        .then((res) => {
          const { request: shop } = res;
          setShop(shop);
          shop.force_open ? setForceOpen(true) : setForceOpen(false);
          setAddress(shop.address);
          setSched(shop.sched);

          let temp = {};
          stocksModel.forEach((stock) => (temp[stock[1]] = shop[stock[1]]));
          setStocks(temp);
        });
  }, [show]);

  useEffect(() => {
    if (shop?.pin_address_lat && shop?.pin_address_lng) {
      const loader = new Loader({ apiKey: import.meta.env.VITE_MAPS_API, version: "weekly" });
      loader.importLibrary("maps").then(() => {
        const map = new window.google.maps.Map(document.getElementById("map"), {
          center: { lat: shop.pin_address_lat, lng: shop.pin_address_lng },
          zoom: 13,
          mapTypeControlOptions: { mapTypeIds: [] },
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
        });
        setMap(map);
      });
    }
  }, [shop]);

  useEffect(() => console.log("stocks", stocks), [stocks]);
  useEffect(() => console.log("shop", shop), [shop]);
  useEffect(() => console.log("sched", sched), [sched]);

  const handleSave = async () => {
    fetch(`${import.meta.env.VITE_API}/shops/${shopId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...stocks,
        force_open: forceOpen,
        address: address,
        pin_address_lat: map.getCenter().lat(),
        pin_address_lng: map.getCenter().lng(),
      }),
    }).then((res) => res.status === 200 && refresh() && onHide());
  };

  return (
    <Modal show={show} onHide={onHide} centered={true} scrollable={true}>
      <ModalHeader closeButton>
        <ModalTitle>Edit Shop</ModalTitle>
      </ModalHeader>
      <ModalBody style={{ maxHeight: "50vh" }}>
        <div className="d-flex flex-column gap-2 p-1 px-sm-4">
          {/* NAME */}
          <div className="form-floating">
            <input type="text" value="Jane Doe Branch" className="form-control" disabled />
            <label>Name</label>
          </div>

          {/* ADDRESS */}
          <div className="form-floating">
            <input type="text" className="form-control" placeholder="Address" id="address" required value={address} onChange={(e) => setAddress(e.target.value)} style={{ flex: 1 }} />
            <label>Address</label>
          </div>

          {/* STATUS */}
          <div className="d-flex align-items-center gap-2">
            <label>Status:</label>
            <select className="form-control form-select-sm" value={forceOpen} onChange={(e) => setForceOpen(e.target.value === "true")}>
              <option value="true">Open</option>
              <option value="false">Closed</option>
            </select>
          </div>

          {/* STOCKS */}
          <div>
            <h6>Stocks</h6>
            <div className="d-flex flex-column gap-1">
              {stocksModel.map((stock, index) => (
                <div className="d-flex align-items-center gap-1 ms-3" key={index} style={{ listStyle: "none" }}>
                  <label>{`${stock[0]}:`}</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder={stock[0]}
                    value={stocks[stock[1]] || 0}
                    onChange={(e) => setStocks((prevStocks) => ({ ...prevStocks, [stock[1]]: e.target.value }))}
                    min="0"
                    max="999"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div>Schedule</div>
            <ul>
              {days.map((day, index) => (
                <li key={index}>
                  <div className="d-flex align-items-center gap-2">
                    {`${day}:`}
                    <input className="form-control" type="time" value={new Date(sched[0].open).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })} />
                    to
                    <input className="form-control" type="time" value={new Date(sched[0].close).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-3 mt-2 w-100">
            <div style={{ position: "relative", width: "100%", alignSelf: "center" }}>
              <div id="map" style={{ height: "300px", width: "100%", position: "relative" }} />
              <img src="marker.png" alt="marker" style={{ position: "absolute", top: "calc(50% - 20px)", left: "calc(50% - 6px)", height: "20px" }} />
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn-cncl fw-semibold rounded-2 py-2 px-4" onClick={onHide}>
          Cancel
        </button>
        <button className="btn-1 fw-semibold rounded-2 py-2 px-4" onClick={handleSave}>
          Save
        </button>
      </ModalFooter>
    </Modal>
  );
}

export default EditShopOwner;
