import { useState } from "react";
import { useEffect } from "react";

function Shop() {
  const [isLoading, setIsLoading] = useState(true);
  const [shop, setShop] = useState(null);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [outForDeliveryOrders, setOutForDeliveryOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);

  useEffect(() => {
    const e = async () => {
      await Promise.all([
        fetch(`${import.meta.env.VITE_API}/shops/${localStorage.getItem("userId")}`, { method: "GET", credentials: "include" })
          .then((res) => res.json())
          .then((res) => {
            setShop(res.request);
            console.log(res.request);
          }),
        fetch(`${import.meta.env.VITE_API}/orders?status_filter=Placed`, { method: "GET", credentials: "include" })
          .then((res) => res.json())
          .then((res) => {
            setPlacedOrders(res.request);
            console.log(res.request);
          }),
        fetch(`${import.meta.env.VITE_API}/orders?status_filter=Preparing`, { method: "GET", credentials: "include" })
          .then((res) => res.json())
          .then((res) => {
            setPreparingOrders(res.request);
            console.log(res.request);
          }),
        fetch(`${import.meta.env.VITE_API}/orders?status_filter=Out For Delivery`, { method: "GET", credentials: "include" })
          .then((res) => res.json())
          .then((res) => {
            setOutForDeliveryOrders(res.request);
            console.log(res.request);
          }),
        fetch(`${import.meta.env.VITE_API}/orders?status_filter=Delivered`, { method: "GET", credentials: "include" })
          .then((res) => res.json())
          .then((res) => {
            setDeliveredOrders(res.request);
            console.log(res.request);
          }),
        fetch(`${import.meta.env.VITE_API}/orders?status_filter=Cancelled`, { method: "GET", credentials: "include" })
          .then((res) => res.json())
          .then((res) => {
            setCancelledOrders(res.request);
            console.log(res.request);
          }),
      ]);
      setIsLoading(false);
    };
    e();
  }, []);

  if (isLoading) return <h3>Loading...</h3>;

  return (
    <>
      <h4>{shop.name}</h4>
      <p>{shop.address + " or " + shop.pin_address}</p>
      <h5>Stocks:</h5>
      <ul style={{ listStyle: "none" }}>
        <li>{"Small: " + shop.stock_small}</li>
        <li>{"Medium: " + shop.stock_medium}</li>
        <li>{"Large: " + shop.stock_large}</li>
        <li>{"Nata: " + shop.stock_nata}</li>
        <li>{"Pearl: " + shop.stock_pearl}</li>
        <li>{"Fruit Jelly: " + shop.stock_fruitjelly}</li>
      </ul>

      <h4>Orders</h4>
      <div style={{ display: "flex", gap: "1rem", margin: "1rem" }}>
        <div style={{ flex: "1" }}>
          <h5>Placed</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {placedOrders.map((order, index) => (
              <div key={index} style={{ border: "1px solid black", padding: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{order.customer.first_name + " " + order.customer.last_name}</div>
                  <div>{`Total: ₱${order.total}`}</div>
                </div>
                <div>{order.customer.pin_address}</div>
                <div>{new Date(order.order_date).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "1" }}>
          <h5>Preparing</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {preparingOrders.map((order, index) => (
              <div key={index} style={{ border: "1px solid black", padding: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{order.customer.first_name + " " + order.customer.last_name}</div>
                  <div>{`Total: ₱${order.total}`}</div>
                </div>
                <div>{order.customer.pin_address}</div>
                <div>{new Date(order.order_date).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "1" }}>
          <h5>Out For Delivery</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {outForDeliveryOrders.map((order, index) => (
              <div key={index} style={{ border: "1px solid black", padding: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{order.customer.first_name + " " + order.customer.last_name}</div>
                  <div>{`Total: ₱${order.total}`}</div>
                </div>
                <div>{order.customer.pin_address}</div>
                <div>{new Date(order.order_date).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "1" }}>
          <h5>Delivered</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {deliveredOrders.map((order, index) => (
              <div key={index} style={{ border: "1px solid black", padding: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{order.customer.first_name + " " + order.customer.last_name}</div>
                  <div>{`Total: ₱${order.total}`}</div>
                </div>
                <div>{order.customer.pin_address}</div>
                <div>{new Date(order.order_date).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "1" }}>
          <h5>Cancelled</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {cancelledOrders.map((order, index) => (
              <div key={index} style={{ border: "1px solid black", padding: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{order.customer.first_name + " " + order.customer.last_name}</div>
                  <div>{`Total: ₱${order.total}`}</div>
                </div>
                <div>{order.customer.pin_address}</div>
                <div>{new Date(order.order_date).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
