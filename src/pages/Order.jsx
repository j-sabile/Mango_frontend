import { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import NotFound from "./NotFound";

function Order() {
  const { orderId } = useParams();
  const [order, setOrder] = useState("Loading");

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/orders/${orderId}`, { method: "GET", credentials: "include" });
      if (res.ok) setOrder((await res.json()).request);
      else setOrder(null);
    };
    init();
  }, []);

  useEffect(() => console.log("order:", order), [order]);

  if (order === "Loading") return;
  else if (order === null) return <NotFound />;
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <NavBar />
      <section className="d-flex justify-content-center px-2 py-3 p-sm-5 flex-fill" style={{ background: "radial-gradient(circle, rgba(252,250,238,1) 35%, rgba(240,229,168,1) 100%)" }}>
        <div className="d-flex flex-column" style={{ width: "700px" }}>
          {/* HEADER */}
          <h1 className="fw-normal m-0 mx-4">My Order</h1>
          <hr className="my-2" />

          {/* ORDER INFO */}
          <div className="card d-flex flex-column border-0 rounded-4" onClick={() => navigate(`/order/${order._id}`)} style={{ boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }}>
            {/* HEADER */}
            <div className="bg-1 d-flex gap-4 rounded-top-4 py-3 px-4 px-sm-5 ">
              <div className="flex-fill text-start">
                <div className="monospace fw-semibold" style={{ color: "grey" }}>
                  NAME
                </div>
                <div className="monospace fw-semibold">{`${order.customer.first_name} ${order.customer.last_name}`.toUpperCase()}</div>
              </div>
              <div className="flex-fill text-end">
                <div className="monospace fw-semibold" style={{ color: "grey" }}>
                  SHOP
                </div>
                <div className="monospace fw-semibold">{order.shop.name.toUpperCase()}</div>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="px-4 py-3 px-sm-5" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "10px" }}>
              {order.order_items.map((orderItem, index) => (
                <Fragment key={index}>
                  <div className="monospace">{`${orderItem.amount}x`}</div>
                  <div className="monospace text-start" style={{ wordBreak: "break-word" }}>
                    {`${orderItem.size} ${orderItem.free_addon || ""}`}
                    <br />
                    {orderItem.addons ? `Addons: ${orderItem.addons.join(", ")}` : ""}
                  </div>
                  <div className="monospace text-end">{`₱${orderItem.subtotal}`}</div>
                </Fragment>
              ))}
              <div />
              <div className="monospace" style={{ color: "#grey" }}>
                Shipping Fee
              </div>
              <div className="monospace text-end">{`₱${order.shipping_fee}`}</div>
              <hr className="m-0" style={{ gridColumn: "1 / 4" }} />
              <div />
              {/* <div className="monospace">{order.payment}</div> */}
              <div className="monospace text-end d-flex align-items-center justify-content-end" style={{ fontSize: "13pt" }}>
                Order Total:
              </div>
              <div className="monospace text-end fw-semibold" style={{ fontSize: "15pt" }}>{`₱${order.total}`}</div>
            </div>
            <hr className="dashed-hr m-0" />

            <div className="d-flex justify-content-between align-items-center px-4 px-sm-5 py-3">
              <div className="monospace text-start">{order.payment.toUpperCase()}</div>
              <div className="monospace text-end">{`${new Date(order.order_date).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Order;
