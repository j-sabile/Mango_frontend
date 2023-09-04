import { useState, useEffect, Fragment } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import ShopCardSkeleton from "../../components/ShopCardSkeleton";

const sizes = ["Small", "Medium", "Large"];

const paymentMethods = ["GCash", "Cash On Delivery"];

function CreateOrder() {
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [myAccount, setMyAccount] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [addOrder, setAddOrder] = useState({ shopId: null, amount: 1, size: null, freeAddon: null, nata: 0, pearl: 0, fruitJelly: 0, payment: "" });

  const freeAddon = [
    { name: "Nata", src: "nata.png", onClick: (e) => setAddOrder({ ...addOrder, nata: addOrder.nata + e }), value: addOrder.nata },
    { name: "Pearl", src: "pearl.png", onClick: (e) => setAddOrder({ ...addOrder, pearl: addOrder.pearl + e }), value: addOrder.pearl },
    { name: "Fruit Jelly", src: "fruitJelly.png", onClick: (e) => setAddOrder({ ...addOrder, fruitJelly: addOrder.fruitJelly + e }), value: addOrder.fruitJelly },
  ];

  useEffect(() => {
    if (userType !== "Customer") navigate("/");
    fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" })
      .then((res) => res.json())
      .then((res) => !res.isLoggedIn && navigate("/sign-in"))
      .finally(() => setLoading(false));
    fetch(`${import.meta.env.VITE_API}/shops/status`, { method: "GET", credentials: "include" })
      .then((res) => res.ok && res.json())
      .then((res) => {
        setShops(res.request);
        setShopsLoading(false);
      });
    fetch(`${import.meta.env.VITE_API}/my-account`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setMyAccount(res.request));
  }, []);

  const handlePlaceOrder = async () => {
    let test = [];
    if (addOrder.nata === 0 && addOrder.pearl === 0 && addOrder.fruitJelly === 0) test = undefined;
    else {
      for (let i = 0; i < addOrder.nata; i++) test.push("Nata");
      for (let i = 0; i < addOrder.pearl; i++) test.push("Pearl");
      for (let i = 0; i < addOrder.fruitJelly; i++) test.push("Fruit Jelly");
    }
    const response = await fetch(`${import.meta.env.VITE_API}/orders`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId: addOrder.shopId,
        orderItems: [{ amount: addOrder.amount, size: addOrder.size, free_addon: addOrder.freeAddon || undefined, addons: test }],
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
    let test = [];
    if (addOrder.nata === 0 && addOrder.pearl === 0 && addOrder.fruitJelly === 0) test = undefined;
    else {
      for (let i = 0; i < addOrder.nata; i++) test.push("Nata");
      for (let i = 0; i < addOrder.pearl; i++) test.push("Pearl");
      for (let i = 0; i < addOrder.fruitJelly; i++) test.push("Fruit Jelly");
    }
    const res = await fetch(`${import.meta.env.VITE_API}/orders/compute`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId: addOrder.shopId,
        orderItems: [{ amount: addOrder.amount, size: addOrder.size, free_addon: addOrder.freeAddon ?? undefined, addons: test }],
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

  if (loading) return;

  return (
    <>
      <NavBar />
      <section className="d-flex justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#EBEBEB" }}>
        <div className="d-flex flex-column align-items-center gap-5 py-5 px-1 px-sm-5" style={{ width: "1000px" }}>
          <h2 className="align-self-center">Create Order</h2>
          <div className="d-flex flex-column gap-5">
            {/* SELECT SHOP */}
            <div className="d-flex flex-column align-items-center gap-1 px-2">
              <h4>Select a shop</h4>
              <div className="row g-1 w-100">
                {shopsLoading ? (
                  <Fragment>
                    <ShopCardSkeleton />
                    <ShopCardSkeleton />
                  </Fragment>
                ) : (
                  shops.map(
                    (shop, index) =>
                      shop.isOpen && (
                        <div className="px-1 col-sm-6 col-12" key={index}>
                          <div
                            className="card rounded-4 px-5 py-3 justify-content-between h-100"
                            style={{ border: `${shop._id === addOrder.shopId ? "2" : "0"}px solid #000814`, cursor: "pointer" }}
                            onClick={() => setAddOrder({ ...addOrder, shopId: shop._id })}>
                            <div>
                              <div style={{ fontWeight: "600" }}>{shop.name}</div>
                              <div>{shop.address}</div>
                              <div>{`Distance: ${shop.distance / 1000}km`}</div>
                              <div>{`Shipping Fee: ₱${shop.shipping_fee}`}</div>
                            </div>
                            <div style={{ fontWeight: "500", alignSelf: "end" }}>Open</div>
                          </div>
                        </div>
                      )
                  )
                )}
                {shops.map(
                  (shop, index) =>
                    !shop.isOpen && (
                      <div className="px-1 col-sm-6 col-12" key={index}>
                        <div className="card border rounded-4 px-5 py-3 justify-content-between text-secondary h-100" style={{ backgroundColor: "#F3F3F3" }}>
                          <div>
                            <div className="fw-semibold">{shop.name}</div>
                            <div>{shop.address}</div>
                          </div>
                          <div className="fw-semibold align-self-end">Closed</div>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* SELECT SIZE */}
            <div className="d-flex flex-column align-items-center gap-1 px-2">
              <h4 className="text-center">Select a size</h4>
              <div className="d-flex gap-2">
                {sizes.map((size, index) => (
                  <div
                    className="card d-flex flex-column align-items-center justify-content-end gap-1 p-2 p-sm-4 rounded-4"
                    key={index}
                    style={{ maxWidth: "220px", height: "100%", border: `${addOrder.size === size ? "2" : "0"}px solid #000814`, cursor: "pointer" }}
                    onClick={() => setAddOrder({ ...addOrder, size: size })}>
                    <img src="mango_cup.png" style={{ width: `${100 + (index - 2) * 12}%` }} />
                    <p className="m-0 fw-semibold text-center" style={{ fontSize: "12pt" }}>
                      {size}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SELECT FREE ADDON */}
            <div className="d-flex flex-column align-items-center gap-1 px-2">
              <h4 className="text-center">Select a free addon</h4>
              <div className="d-flex gap-2">
                {freeAddon.map((addon, index) => (
                  <div
                    key={index}
                    className="card d-flex flex-column align-items-center justify-content-center gap-1 p-3 p-sm-5 rounded-4"
                    style={{ flex: 1, maxWidth: "220px", height: "100%", border: `${addOrder.freeAddon === addon.name ? "2" : "0"}px solid #000814`, cursor: "pointer" }}
                    onClick={() => setAddOrder({ ...addOrder, freeAddon: addon.name })}>
                    <img src={addon.src} alt={addon.name} style={{ width: "100%" }} />

                    <p className="m-0 fw-semibold text-center" style={{ fontSize: "12pt" }}>
                      {addon.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex flex-column align-items-center gap-1 px-2">
              <h4 className="text-center">{"Add another addon (optional)"}</h4>
              <div className="d-flex gap-2">
                {freeAddon.map((addon, index) => (
                  <div key={index} className="card d-flex flex-column align-items-center justify-content-end gap-1 p-2 pb-3 pt-3 p-sm-5 pb-sm-4 rounded-4" style={{ flex: 1, maxWidth: "220px", height: "100%" }}>
                    <img src={addon.src} alt={addon.name} style={{ width: "100%" }} />
                    <p className="m-0 fw-semibold text-center" style={{ fontSize: "12pt" }}>
                      {addon.name}
                    </p>
                    <div className="d-flex align-items-center gap-1 justify-content-center">
                      <button className="btn-1 rounded-2 px-2 px-sm-2 fw-semibold" onClick={() => addon.value > 0 && addon.onClick(-1)}>
                        -
                      </button>
                      <label className="py-1 px-1 px-sm-3 rounded-2" style={{ backgroundColor: "#DDDDDD" }}>
                        {addon.value}
                      </label>
                      <button className="btn-1 rounded-2 px-2 px-sm-2 fw-semibold" onClick={() => addon.value < 2 && addon.onClick(1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="d-flex align-items-center justify-content-center gap-2">
              <h5 style={{ margin: "0px" }}>Quantity:</h5>
              <input type="number" className="form-control" min="1" max="15" style={{ width: "60px" }} value={addOrder.amount} onChange={(e) => setAddOrder({ ...addOrder, amount: e.target.value })} />
            </div>

            {/* ORDER BUTTON  */}
            <div className="d-flex justify-content-end px-3">
              {/* <button>Add To Cart</button> */}
              <button className="btn-1 px-4 py-2 rounded-3 fw-semibold" disabled={statusPreBuyNow()} onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

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
                    className="flex-fill py-3 align-items-center justify-content-center"
                    style={{
                      border: `${addOrder.payment === payment ? "2" : "1"}px solid black`,
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontWeight: addOrder.payment === payment ? "500" : "400",
                    }}
                    onClick={() => setAddOrder({ ...addOrder, payment })}
                    key={index}>
                    <p className="m-0 text-center">{payment}</p>
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
                  <div className="grid-item">{`${order.size} ${order.free_addon ?? ""}${order.addons ? `, Addons: ${order.addons.join(", ")}` : ""}`}</div>
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
            <button className="btn-1 px-4 py-2 rounded-3 fw-semibold" onClick={handlePlaceOrder} disabled={!paymentMethods.includes(addOrder.payment)}>
              Place Order
            </button>
          </ModalFooter>
        </Modal>
      )}

      {/* ORDER SUCCESS MODAL */}
      <Modal show={showOrderSuccess} onHide={() => setShowOrderSuccess(false)} centered={true}>
        <div className="d-flex flex-column align-items-center gap-4" style={{ padding: "3rem 4rem" }}>
          <h3 className="text-center">Order success!</h3>
          <button className="btn-1 px-4 py-2 rounded-2 fw-semibold" onClick={() => navigate("/my-orders")}>
            Continue
          </button>
        </div>
      </Modal>
    </>
  );
}

export default CreateOrder;
