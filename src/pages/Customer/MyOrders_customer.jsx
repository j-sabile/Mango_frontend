import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";

const navOptions = ["Placed", "Preparing", "Out For Delivery", "Delivered", "Cancelled"];

function MyOrders() {
  const [myOrders, setMyOrders] = useState([]);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [preparedOrders, setPreparedOrders] = useState([]);
  const [outForDeliveryOrders, setOutForDeliveryOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [selectedNav, setSelectedNav] = useState("Placed");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/orders?status_filter=Placed`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        setPlacedOrders(res.request);
        setMyOrders(res.request);
      });
    fetch(`${import.meta.env.VITE_API}/orders?status_filter=Preparing`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setPreparedOrders(res.request));
    fetch(`${import.meta.env.VITE_API}/orders?status_filter=Out For Delivery`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setOutForDeliveryOrders(res.request));
    fetch(`${import.meta.env.VITE_API}/orders?status_filter=Delivered`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setDeliveredOrders(res.request));
    fetch(`${import.meta.env.VITE_API}/orders?status_filter=Cancelled`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setCancelledOrders(res.request));
  }, []);

  useEffect(() => console.log("myOrders:", myOrders), [myOrders]);
  useEffect(() => console.log("placedOrders:", placedOrders), [placedOrders]);
  useEffect(() => console.log("preparedOrders:", preparedOrders), [preparedOrders]);
  useEffect(() => console.log("outForDeliveryOrders:", outForDeliveryOrders), [outForDeliveryOrders]);
  useEffect(() => console.log("deliveredOrders:", deliveredOrders), [deliveredOrders]);
  useEffect(() => console.log("cancelledOrders:", cancelledOrders), [cancelledOrders]);

  const handleSelectNav = (nav) => {
    setSelectedNav(nav);
    if (nav === "Placed") setMyOrders(placedOrders);
    else if (nav === "Preparing") setMyOrders(preparedOrders);
    else if (nav === "Out For Delivery") setMyOrders(outForDeliveryOrders);
    else if (nav === "Delivered") setMyOrders(deliveredOrders);
    else if (nav === "Cancelled") setMyOrders(cancelledOrders);
  };
  return (
    <div className="d-flex flex-column overflow-hidden" style={{ height: "100vh" }}>
      <NavBar />
      <section className="container d-flex flex-column flex-fill py-3 py-sm-5">
        <h3>My Orders</h3>

        <div className="d-flex flex-column gap-3 flex-fill">
          {/* NAVIGATION TILES */}
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            {navOptions.map((nav, index) => (
              <div
                className="flex-fill text-center py-2 px-3"
                style={{
                  borderBottom: selectedNav === nav ? "2px solid black" : "",
                  fontWeight: selectedNav === nav ? "500" : "400",
                  cursor: "pointer",
                }}
                tabIndex="0"
                key={index}
                onClick={() => handleSelectNav(nav)}
                onKeyDown={(e) => e.key === "Enter" && handleSelectNav(nav)}>
                {nav}
              </div>
            ))}
          </div>

          {/* NAVIGATION BODY */}
          <div className="d-flex flex-column gap-3 px-0 px-sm-5 flex-fill" style={{ overflowY: "scroll", height: "1px" }}>
            {myOrders.map((order, index) => (
              <div className="d-flex flex-column card px-4 py-3" key={index}>
                <div style={{ fontSize: "10pt", fontWeight: "500" }}>{order.shop.name}</div>
                <hr />
                {order.order_items.map((orderItem, index2) => (
                  <div className="d-flex justify-content-between my-1 px-2" key={index2}>
                    <div>{`${orderItem.amount}x ${orderItem.size} ${orderItem.free_addon || ""}${orderItem.addons ? `, Addons: ${orderItem.addons.join(", ")}` : ""}`}</div>
                    <div>{`₱${orderItem.subtotal}`}</div>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ fontSize: "10pt" }}>{new Date(order.order_date).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                  <div className="text-end">
                    <span style={{ fontSize: "13pt" }}>Order Total: </span>
                    <span style={{ fontSize: "15pt", fontWeight: "500" }}>{`₱${order.total}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MyOrders;
