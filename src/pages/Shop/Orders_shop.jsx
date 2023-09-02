import NavBar from "../../components/NavBar";
import { useEffect, useState } from "react";

function Orders() {
  const handleMoveToCancelled = async (orderId, toRefresh) => await handleMoveOrder(orderId, "Cancelled", [toRefresh, "Cancelled"]);
  const handleMoveToPreparing = async (orderId) => await handleMoveOrder(orderId, "Preparing", ["Placed", "Preparing"]);
  const handleMoveToOutForDelivery = async (orderId) => await handleMoveOrder(orderId, "Out For Delivery", ["Preparing", "Out For Delivery"]);
  const handleMoveToDelivered = async (orderId) => await handleMoveOrder(orderId, "Delivered", ["Out For Delivery", "Delivered"]);
  const handleMoveOrder = async (orderId, status, toRefresh) => {
    await fetch(`${import.meta.env.VITE_API}/orders/${orderId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }),
    }).then((res) => {
      if (res.ok && toRefresh) {
        if (toRefresh.includes("Placed")) fetchPlacedOrders();
        if (toRefresh.includes("Preparing")) fetchPreparingOrders();
        if (toRefresh.includes("Out For Delivery")) fetchOutForDeliveryOrders();
        if (toRefresh.includes("Delivered")) fetchDeliveredOrders();
        if (toRefresh.includes("Cancelled")) fetchCancelledOrders();
      }
    });
  };
  const navOptions = [
    {
      name: "Placed",
      dropdown: [
        { name: "Move to Preparing", onClick: handleMoveToPreparing },
        { name: "Move to Cancelled", onClick: handleMoveToCancelled },
      ],
    },
    {
      name: "Preparing",
      dropdown: [
        { name: "Move to Out For Delivery", onClick: handleMoveToOutForDelivery },
        { name: "Move to Cancelled", onClick: handleMoveToCancelled },
      ],
    },
    { name: "Out For Delivery", dropdown: [{ name: "Move to Delivered", onClick: handleMoveToDelivered }] },
    { name: "Delivered" },
    { name: "Cancelled" },
  ];
  const fetchPlacedOrders = async (isSetMyOrder) => {
    fetch(`${import.meta.env.VITE_API}/orders?status_filter=Placed`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        setPlacedOrders(res.request);
        if (isSetMyOrder) setMyOrders(res.request);
      });
  };
  const fetchPreparingOrders = async () => {
    fetch(`${import.meta.env.VITE_API}/orders?status_filter=Preparing`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setPreparedOrders(res.request));
  };
  const fetchOutForDeliveryOrders = async () => {
    fetch(`${import.meta.env.VITE_API}/orders?status_filter=Out For Delivery`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setOutForDeliveryOrders(res.request));
  };
  const fetchDeliveredOrders = async () => {
    fetch(`${import.meta.env.VITE_API}/orders?status_filter=Delivered`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setDeliveredOrders(res.request));
  };
  const fetchCancelledOrders = async () => {
    fetch(`${import.meta.env.VITE_API}/orders?status_filter=Cancelled`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setCancelledOrders(res.request));
  };

  const [myOrders, setMyOrders] = useState([]);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [preparedOrders, setPreparedOrders] = useState([]);
  const [outForDeliveryOrders, setOutForDeliveryOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [selectedNav, setSelectedNav] = useState(navOptions[0]);

  useEffect(() => {
    fetchPlacedOrders(true);
    fetchPreparingOrders();
    fetchOutForDeliveryOrders();
    fetchDeliveredOrders();
    fetchCancelledOrders();
  }, []);

  const handleSelectNav = (nav) => {
    setSelectedNav(nav);
    if (nav.name === "Placed") setMyOrders(placedOrders);
    else if (nav.name === "Preparing") setMyOrders(preparedOrders);
    else if (nav.name === "Out For Delivery") setMyOrders(outForDeliveryOrders);
    else if (nav.name === "Delivered") setMyOrders(deliveredOrders);
    else if (nav.name === "Cancelled") setMyOrders(cancelledOrders);
  };

  useEffect(() => {
    if (selectedNav.name === "Placed") setMyOrders(placedOrders);
  }, [selectedNav, placedOrders]);
  useEffect(() => {
    if (selectedNav.name === "Preparing") setMyOrders(preparedOrders);
  }, [selectedNav, preparedOrders]);
  useEffect(() => {
    if (selectedNav.name === "Out For Delivery") setMyOrders(outForDeliveryOrders);
  }, [selectedNav, outForDeliveryOrders]);
  useEffect(() => {
    if (selectedNav.name === "Delivered") setMyOrders(deliveredOrders);
  }, [selectedNav, deliveredOrders]);
  useEffect(() => {
    if (selectedNav.name === "Cancelled") setMyOrders(cancelledOrders);
  }, [selectedNav, cancelledOrders]);

  return (
    <div className="d-flex flex-column overflow-hidden" style={{ height: "100vh" }}>
      <NavBar />
      <section className="d-flex flex-column flex-fill py-3 py-sm-5" style={{ background: "radial-gradient(circle, rgba(252,250,238,1) 35%, rgba(240,229,168,1) 100%)" }}>
        <div className="container d-flex flex-column flex-fill">
          <h3>Orders</h3>
          <div className="d-flex flex-column gap-3 flex-fill">
            {/* NAVIGATION TILES */}
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              {navOptions.map((nav, index) => (
                <div
                  className="flex-fill text-center py-2 px-3"
                  style={{
                    borderBottom: selectedNav.name === nav.name ? "2px solid black" : "",
                    fontWeight: selectedNav.name === nav.name ? "500" : "400",
                    cursor: "pointer",
                  }}
                  tabIndex="0"
                  key={index}
                  onClick={() => handleSelectNav(nav)}
                  onKeyDown={(e) => e.key === "Enter" && handleSelectNav(nav)}>
                  {nav.name}
                </div>
              ))}
            </div>

            {/* NAVIGATION BODY */}
            <div className="d-flex flex-column gap-3 px-0 px-sm-5 py-2 flex-fill" style={{ overflowY: "auto", height: "1px" }}>
              {myOrders.map((order, index) => (
                <div className="card d-flex flex-column border-0 rounded-4 px-4 py-3" style={{ boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }} key={index}>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "12pt", fontWeight: "500" }}>{`${order.customer.first_name} ${order.customer.last_name}`}</div>

                    {/* DROPDOWN */}
                    {selectedNav.dropdown && (
                      <div className="dropdown">
                        <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" />
                        <div className="dropdown-menu">
                          {selectedNav.dropdown.map((option, index) => (
                            <button className="dropdown-item btn" onClick={() => option.onClick(order._id, selectedNav.name)} key={index}>
                              {option.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <hr />
                  {order.order_items.map((orderItem, index2) => (
                    <div className="d-flex justify-content-between my-1 px-2" key={index2}>
                      <div>{`${orderItem.amount}x ${orderItem.size} ${orderItem.free_addon || ""}${orderItem.addons ? `,  Addons: ${orderItem.addons.join(", ")}` : ""}`}</div>
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
        </div>
      </section>
    </div>
  );
}

export default Orders;
