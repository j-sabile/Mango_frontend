import { Fragment, useState } from "react";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";

function EditMyAccountModal({ show, onHide, refresh, shop }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Open");
  const [small, setSmall] = useState(0);
  const [medium, setMedium] = useState(0);
  const [large, setLarge] = useState(0);
  const [nata, setNata] = useState(0);
  const [pearl, setPearl] = useState(0);
  const [fruitJelly, setFruitJelly] = useState(0);

  const stocksModel = [
    { name: "Small", value: small, onChangeValue: (e) => setSmall(e.target.value) },
    { name: "Medium", value: medium, onChangeValue: (e) => setMedium(e.target.value) },
    { name: "Large", value: large, onChangeValue: (e) => setLarge(e.target.value) },
    { name: "Nata", value: nata, onChangeValue: (e) => setNata(e.target.value) },
    { name: "Pearl", value: pearl, onChangeValue: (e) => setPearl(e.target.value) },
    { name: "Fruit Jelly", value: fruitJelly, onChangeValue: (e) => setFruitJelly(e.target.value) },
  ];

  useEffect(() => {
    if (shop) {
      setName(shop.name);
      setAddress(shop.address);
      setSmall(shop.stock_small);
      setMedium(shop.stock_medium);
      setLarge(shop.stock_large);
      setNata(shop.stock_nata);
      setPearl(shop.stock_pearl);
      setFruitJelly(shop.stock_fruitjelly);
    }
  }, [shop]);

  const handleSave = async () => {
    fetch(`${import.meta.env.VITE_API}/my-account`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: address,
        force_open: status === "Open",
        stock_small: small,
        stock_medium: medium,
        stock_large: large,
        stock_nata: nata,
        stock_pearl: pearl,
        stock_fruitjelly: fruitJelly,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        refresh();
        onHide();
      });
  };

  if (!shop) return;

  return (
    <Modal show={show} onHide={onHide} centered={true}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Shop</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-1 px-sm-4">
          {/* BASIC INFO */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "5px" }}>
            <div className="d-flex align-items-center">
              <h6 className="m-0">Name:</h6>
            </div>
            <input type="text" value={name} className="form-control" disabled />
            <div className="d-flex align-items-center">
              <h6 className="m-0">Address:</h6>
            </div>
            <input type="text" value={address} className="form-control" onChange={(e) => setAddress(e.target.value)} />
            <div className="d-flex align-items-center">
              <h6 className="m-0">Status:</h6>
            </div>
            <select className="form-control form-select-sm p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option className="fs-6" value="Open">
                Open
              </option>
              <option className="fs-6" value="Closed">
                Closed
              </option>
            </select>
          </div>
          <hr />

          {/* STOCKS */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto 1fr", gap: "10px" }}>
            {stocksModel.map((stock, index) => (
              <Fragment key={index}>
                <div className="d-flex align-items-center p-0">
                  <h6 className="m-0">{`${stock.name}:`}</h6>
                </div>
                <input type="number" className="form-control" value={stock.value} onChange={stock.onChangeValue} min="0" max="999" />
              </Fragment>
            ))}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn-cncl fw-semibold px-4 py-2 rounded-3" onClick={() => setShowEdit(false)}>
          Cancel
        </button>
        <button className="btn-1 fw-semibold px-4 py-2 rounded-3" onClick={handleSave}>
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditMyAccountModal;
