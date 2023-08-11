import { Modal } from "react-bootstrap";

function DeleteShopOwner({ show, onHide, shopId, shopName, refresh }) {
  const handleDelete = async () => {
    fetch(`${import.meta.env.VITE_API}/shops/${shopId}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => res.status === 200 && refresh() && onHide());
  };

  return (
    <Modal show={show} onHide={onHide} centered={true}>
      <div style={{ padding: "2rem 4rem", display: "flex", flexDirection: "column" }}>
        <h4 style={{ textAlign: "center" }}>{`Are you sure you want to delete ${shopName}?`}</h4>
        <button onClick={handleDelete}>Yes</button>
        <button onClick={onHide}>No</button>
      </div>
    </Modal>
  );
}

export default DeleteShopOwner;
