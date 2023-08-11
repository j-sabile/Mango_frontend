import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
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
          zoom: 15,
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
        <ModalTitle>Edit</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div style={{ padding: "0.5rem 2rem", display: "flex", flexDirection: "column", gap: "0.5rem", height: "75vh" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div>Status:</div>
            <div style={{ width: "1rem" }} />
            <input type="checkbox" checked={forceOpen} onChange={() => setForceOpen(true)} id="open" />
            <label htmlFor="open">Open</label>
            <div style={{ width: "0.5rem" }} />
            <input type="checkbox" checked={!forceOpen} onChange={() => setForceOpen(false)} id="close" />
            <label htmlFor="close">Close</label>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label htmlFor="address">Address:</label>
            <input type="text" placeholder="Address" id="address" required value={address} onChange={(e) => setAddress(e.target.value)} style={{ flex: 1 }} />
          </div>

          <div style={{ position: "relative", width: "100%" }}>
            <div id="map" style={{ height: "200px", width: "100%", position: "relative" }} />
            <img
              src="https://www.nicepng.com/png/detail/295-2955914_red-marker-on-map.png"
              alt="Marker"
              style={{ position: "absolute", top: "calc(50% - 20px)", left: "calc(50% - 12px)", height: "20px" }}
            />
          </div>

          <div>
            <div>Stocks</div>
            <ul>
              {stocksModel.map((stock, index) => (
                <li key={index} style={{ listStyle: "none" }}>
                  <label>{stock[0] + ":"}</label>
                  <input
                    type="number"
                    placeholder={stock[0]}
                    value={stocks[stock[1]] || 0}
                    // prettier-ignore
                    onChange={(e) => setStocks((prevStocks) => ({ ...prevStocks, [stock[1]]: e.target.value }))}
                    min="0"
                    max="999"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div>Schedule</div>
            <ul>
              {days.map((day, index) => (
                <li key={index}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {`${day}:`}
                    <input type="time" value={new Date(sched[0].open).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })} />
                    to
                    <input type="time" value={new Date(sched[0].close).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleSave}>Save</button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default EditShopOwner;
