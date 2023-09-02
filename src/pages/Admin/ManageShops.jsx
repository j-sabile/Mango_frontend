import { useState, useEffect } from "react";
import AddShopOwner from "./ShopOwner/AddShopOwner_admin";
import DeleteShopOwner from "./ShopOwner/DeleteShopOwner_admin";
import EditShopOwner from "./ShopOwner/EditShopOwner_admin";

function ManageShops() {
  const [shops, setShops] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/shops`, { method: "GET", credentials: "include" })
      .then((res) => res.ok && res.json())
      .then((res) => setShops(res.request));
  }, []);

  const loadShops = async () => {
    setShops(null);
    fetch(`${import.meta.env.VITE_API}/shops`, { method: "GET", credentials: "include" })
      .then((res) => res.ok && res.json())
      .then((res) => setShops(res.request));
  };

  const handleOpenEditModal = (shop) => {
    setSelectedShop(shop);
    setShowEdit(true);
  };
  const handleOpenDeleteModal = (shop) => {
    setSelectedShop(shop);
    setShowDelete(true);
  };

  useEffect(() => console.log("shops:", shops), [shops]);

  return (
    <>
      <div className="d-flex flex-column gap-3 flex-fill">
        {/* HEADER */}
        <div className="d-flex justify-content-between">
          <h3>Shops</h3>
          <div className="d-flex gap-3">
            <button className="btn-cncl rounded-3 px-3 py-1 fw-semibold" onClick={loadShops}>
              Reload
            </button>
            <button className="btn-1 px-4 rounded-3 fw-semibold" onClick={() => setShowAdd(true)}>
              Add
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="d-flex flex-column gap-2 p-1 p-sm-3 flex-fill" style={{ overflowY: "auto", height: "1px" }}>
          {shops?.map((shop, index) => (
            <div
              className="d-flex flex-row justify-content-between align-items-center gap-2 p-3 py-sm-4 px-sm-5"
              style={{ borderRadius: "1rem", backgroundColor: "#FFFFFF", boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }}
              key={index}>
              <div className="fw-semibold" style={{ letterSpacing: "0.1px", fontSize: "13pt" }}>
                {shop.name}
              </div>
              <div className="d-flex gap-2">
                <button className="btn-cncl rounded-3 px-3 py-1" onClick={() => handleOpenEditModal(shop)}>
                  Edit
                </button>
                <button className="btn-dngr rounded-3 px-3 py-1" onClick={() => handleOpenDeleteModal(shop)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddShopOwner show={showAdd} onHide={() => setShowAdd(false)} refresh={loadShops} />
      <EditShopOwner show={showEdit} onHide={() => setShowEdit(false)} refresh={loadShops} shopId={selectedShop?._id} />
      <DeleteShopOwner show={showDelete} onHide={() => setShowDelete(false)} refresh={loadShops} shop={selectedShop} />
    </>
  );
}

export default ManageShops;
