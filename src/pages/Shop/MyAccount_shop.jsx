import { useState, useEffect, Fragment } from "react";
import NavBar from "../../components/NavBar";
import { Modal } from "react-bootstrap";
import EditMyAccountModal from "../../components/Modals/Shop/EditMyAccountModal";

const stocksModel = [
  ["Small", "stock_small"],
  ["Nata", "stock_nata"],
  ["Medium", "stock_medium"],
  ["Pearl", "stock_pearl"],
  ["Large", "stock_large"],
  ["Fruit Jelly", "stock_fruitjelly"],
];
function MyAccountShop() {
  const [myAccount, setMyAccount] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    loadMyAccount();
  }, []);

  const loadMyAccount = async () => {
    fetch(`${import.meta.env.VITE_API}/my-account`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setMyAccount(res.request));
  };

  useEffect(() => console.log("myAccount:", myAccount), [myAccount]);

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
            </div>
          </div>
        </div>
      </section>
      <EditMyAccountModal show={showEdit} shop={myAccount} onHide={() => setShowEdit(false)} refresh={loadMyAccount} />
    </div>
  );
}

export default MyAccountShop;
