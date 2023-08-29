import { useState, useEffect, Fragment } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import NavBar from "../../components/NavBar";

const sizes = ["Small", "Medium", "Large"];
const freeAddon = ["Nata", "Pearl", "Fruit Jelly"];
const paymentMethods = ["GCash", "Cash On Delivery"];

function CreateOrder() {
  const [shops, setShops] = useState([]);
  const [myAccount, setMyAccount] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [addOrder, setAddOrder] = useState({ shopId: null, amount: 1, size: null, freeAddon: null, addons: [], payment: "" });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" })
      .then((res) => res.json())
      .then((res) => console.log(res));
    fetch(`${import.meta.env.VITE_API}/shops/status`, { method: "GET", credentials: "include" })
      .then((res) => res.ok && res.json())
      .then((res) => setShops(res.request));
    fetch(`${import.meta.env.VITE_API}/my-account`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setMyAccount(res.request));
  }, []);

  const handlePlaceOrder = async () => {
    const response = await fetch(`${import.meta.env.VITE_API}/orders`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId: addOrder.shopId,
        orderItems: [{ amount: addOrder.amount, size: addOrder.size }],
        payment: addOrder.payment,
      }),
    });
    const responseData = await response.json();
    if (response.ok) {
      setShowCheckout(false);
      setShowOrderSuccess(true);
    } else alert(responseData.message);
  };

  const handleBuyNow = async () => {
    const res = await fetch(`${import.meta.env.VITE_API}/orders/compute`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId: addOrder.shopId,
        orderItems: [{ amount: addOrder.amount, size: addOrder.size, free_addon: addOrder.freeAddon ?? undefined, addons: addOrder.addons }],
      }),
    });
    if (res.ok) {
      setCheckoutInfo((await res.json()).request);
      setShowCheckout(true);
    }
  };

  const statusPreBuyNow = () => {
    if (!sizes.includes(addOrder.size)) return true;
    if (addOrder.shopId === "" || addOrder.shopId === null) return true;
    return false;
  };

  return (
    <>
      <NavBar />
      <h3>Create Order</h3>
      <br />
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* SELECT SHOP */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h5>Select a shop</h5>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {shops.map((shop, index) =>
              shop.isOpen ? (
                <div
                  key={index}
                  style={{ border: `${shop._id === addOrder.shopId ? "3" : "1"}px solid black`, padding: "1rem", borderRadius: "1rem", cursor: "pointer", display: "flex", flexDirection: "column" }}
                  onClick={() => setAddOrder({ ...addOrder, shopId: shop._id })}>
                  <div>
                    <div style={{ fontWeight: "500" }}>{shop.name}</div>
                    <div>{shop.address}</div>
                    <div>{`Distance: ${shop.distance / 1000}km`}</div>
                    <div>{`Shipping Fee: ₱${shop.shipping_fee}`}</div>
                  </div>
                  <div style={{ fontWeight: "500", alignSelf: "end" }}>Open</div>
                </div>
              ) : (
                <div key={index} style={{ border: "1px solid grey", borderRadius: "1rem", padding: "1rem", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "grey" }}>
                  <div>
                    <div style={{ fontWeight: "500" }}>{shop.name}</div>
                    <div>{shop.address}</div>
                  </div>
                  <div style={{ fontWeight: "500", alignSelf: "end" }}>Closed</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* SELECT SIZE */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h5>Select a size</h5>
          <div style={{ display: "flex", gap: "1rem" }}>
            {sizes.map((size, index) => (
              <div key={index} style={{ border: `${addOrder.size === size ? "3" : "1"}px solid black`, borderRadius: "1rem", cursor: "pointer", padding: "1rem" }} onClick={() => setAddOrder({ ...addOrder, size: size })}>
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* SELECT FREE ADDON */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h5>Select a free addon</h5>
          <div style={{ display: "flex", gap: "1rem" }}>
            {freeAddon.map((addon, index) => (
              <div
                key={index}
                style={{ border: `${addOrder.freeAddon === addon ? "3" : "1"}px solid black`, borderRadius: "1rem", cursor: "pointer", padding: "1rem" }}
                onClick={() => setAddOrder({ ...addOrder, freeAddon: addon })}>
                {addon}
              </div>
            ))}
          </div>
        </div>

        {/* QUANTITY */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h5 style={{ margin: "0px" }}>Quantity:</h5>
          <input type="number" min="1" max="10" style={{ width: "30px" }} value={addOrder.amount} onChange={(e) => setAddOrder({ ...addOrder, amount: e.target.value })} />
        </div>

        {/* ORDER BUTTON  */}
        <div>
          <button>Add To Cart</button>
          <button disabled={statusPreBuyNow()} onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {myAccount && (
        <Modal show={showCheckout} onHide={() => setShowCheckout(false)} centered={true}>
          <ModalHeader closeButton>
            <ModalTitle>Checkout</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>
              <span style={{ fontSize: "14pt", fontWeight: "500", marginRight: "1rem" }}>{`${myAccount.first_name} ${myAccount.last_name}`}</span>
              <span style={{ fontSize: "14pt", fontWeight: "500", color: "grey" }}>{myAccount.phone_number}</span>
              <br />
              {myAccount.address}
            </p>
            <hr />

            <div style={{ margin: "1rem 0rem" }}>
              <p style={{ margin: "0", fontSize: "14pt" }}>Select Payment Method</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {paymentMethods.map((payment, index) => (
                  <div
                    style={{
                      border: `${addOrder.payment === payment ? "2" : "1"}px solid black`,
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontWeight: addOrder.payment === payment ? "500" : "400",
                    }}
                    onClick={() => setAddOrder({ ...addOrder, payment })}
                    key={index}>
                    {payment}
                  </div>
                ))}
              </div>
            </div>
            <hr />

            <h5>Order Summary</h5>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "7px", fontSize: "14pt", gridTemplateRows: "auto", maxWidth: "250px" }}>
              {checkoutInfo?.orderItems?.map((order, index) => (
                <Fragment key={index}>
                  <div className="grid-item">{`${order.amount}x`}</div>
                  <div className="grid-item">{`${order.size} ${order.free_addon ?? ""}`}</div>
                  <div className="grid-item">{`₱${order.price}`}</div>
                </Fragment>
              ))}
              <div className="grid-item" />
              <div className="grid-item">{"Shipping Fee"}</div>
              <div className="grid-item">{`₱${checkoutInfo?.shippingFee}`}</div>
              <div className="grid-item" />
              <div className="grid-item">{"Total"}</div>
              <div className="grid-item" style={{ fontWeight: "500" }}>
                {`₱${checkoutInfo?.total}`}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={handlePlaceOrder} disabled={!paymentMethods.includes(addOrder.payment)}>
              Place Order
            </button>
          </ModalFooter>
        </Modal>
      )}

      {/* ORDER SUCCESS MODAL */}
      <Modal show={showOrderSuccess} onHide={() => setShowOrderSuccess(false)} centered={true} size="sm">
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <h5>Order success!</h5>
          <button onClick={() => setShowOrderSuccess(false)}>Continue</button>
        </div>
      </Modal>
    </>
  );
}

export default CreateOrder;
