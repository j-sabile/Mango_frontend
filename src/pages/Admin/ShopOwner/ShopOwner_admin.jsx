import { useEffect, useState } from "react";
import { Modal, ModalTitle } from "react-bootstrap";
import AddShopOwner from "./AddShopOwner_admin";
import DeleteShopOwner from "./DeleteShopOwner_admin";
import EditShopOwner from "./EditShopOwner_admin";
import ViewShopOwner from "./ViewShopOwner_admin";

function ShopOwner() {
  const [shops, setShops] = useState([]);
  const [targetShopId, setTargetShopId] = useState("");
  const [targetShopName, setTargetShopName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/shops`, { credentials: "include" })
      .then((res) => res.status === 200 && res.json())
      .then((res) => setShops(res.request));
  }, []);

  const refresh = () => {
    fetch(`${import.meta.env.VITE_API}/shops`, { credentials: "include" })
      .then((res) => res.status === 200 && res.json())
      .then((res) => setShops(res.request));
    return true;
  };

  useEffect(() => console.log(shops), [shops]);

  const handleViewShop = (shopId) => {
    setTargetShopId(shopId);
    setShowView(true);
  };

  const hanldeEditShop = (shopId) => {
    setTargetShopId(shopId);
    setShowEdit(true);
  };

  const hanldeDeleteShop = (shopId, shopName) => {
    setTargetShopId(shopId);
    setTargetShopName(shopName);
    setShowDelete(true);
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
          <button onClick={() => hanldeDeleteShop(shop._id, shop.name)}>Delete</button>
        </div>
      ))}
      <AddShopOwner show={showAdd} onHide={() => setShowAdd(false)} refresh={refresh} />
      <EditShopOwner show={showEdit} onHide={() => setShowEdit(false)} refresh={refresh} shopId={targetShopId} />
      <Modal show={showView} onHide={() => setShowView(false)} centered={true}>
        <ViewShopOwner shopId={targetShopId} />
      </Modal>

      <DeleteShopOwner show={showDelete} onHide={() => setShowDelete(false) && true} shopId={targetShopId} shopName={targetShopName} refresh={refresh} />
    </>
  );
}

export default ShopOwner;
