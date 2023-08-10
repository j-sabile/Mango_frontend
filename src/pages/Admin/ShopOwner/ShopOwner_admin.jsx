import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import AddShopOwner from "./AddShopOwner_admin";
import EditShopOwner from "./EditShopOwner_admin";
import ViewShopOwner from "./ViewShopOwner_admin";

function ShopOwner() {
  const [shops, setShops] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [targetShopId, setTargetShopId] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/shops`, { credentials: "include" })
      .then((res) => res.status === 200 && res.json())
      .then((res) => setShops(res.request));
  }, []);

  useEffect(() => console.log(shops), [shops]);

  const handleViewShop = (shopId) => {
    setTargetShopId(shopId);
    setShowView(true);
  };

  const hanldeEditShop = (shopId) => {
    setTargetShopId(shopId);
    setShowEdit(true);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h3>Shop Owners</h3>
        <button onClick={() => setShowAdd(true)}>Add</button>
      </div>
      {shops.map((shop, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <p>{shop.name}</p>
          <button onClick={() => handleViewShop(shop._id)}>View</button>
          <button onClick={() => hanldeEditShop(shop._id)}>Edit</button>
          <button>Delete</button>
        </div>
      ))}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered={true}>
        Edit
      </Modal>
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Shop Owner</Modal.Title>
        </Modal.Header>
        <div style={{ padding: "2rem" }}>
          <AddShopOwner />
        </div>
      </Modal>
      <Modal show={showView} onHide={() => setShowView(false)} centered={true}>
        <ViewShopOwner shopId={targetShopId} />
      </Modal>
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered={true}>
        <EditShopOwner shopId={targetShopId} />
      </Modal>
    </>
  );
}

export default ShopOwner;
