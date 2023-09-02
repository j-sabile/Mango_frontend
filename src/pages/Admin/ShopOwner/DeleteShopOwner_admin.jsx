import { Modal } from "react-bootstrap";

function DeleteShopOwner({ show, onHide, shop, refresh }) {
  const handleDelete = async () => {
    fetch(`${import.meta.env.VITE_API}/shops/${shop._id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => res.status === 200 && refresh() && onHide());
  };

  return (
    <Modal show={show} onHide={onHide} centered={true}>
      <div className="d-flex flex-column gap-3 p-5">
        <h3 className="text-center">Delete Shop</h3>
        <p className="text-center">{`You're going to delete "${shop?.name}". Are you sure?`}</p>
        <div className="d-flex justify-content-center flex-wrap">
          {/* <button className="btn rounded-pill fw-semibold mx-2 my-1" style={{ backgroundColor: "#F3F7F3", boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)", padding: "0.4rem 2.2rem" }}>
            No, Keep It.
          </button> */}
          <button className="btn-cncl rounded-pill fw-semibold m-2 px-4 py-2" onClick={() => onHide(false)}>
            No, Keep It.
          </button>
          <button className="btn-dngr rounded-pill fw-semibold m-2 px-4 py-2" onClick={handleDelete}>
            Yes, Delete!
          </button>
        </div>
      </div>
      {/* <div style={{ padding: "2rem 4rem", display: "flex", flexDirection: "column" }}>
        <h4 style={{ textAlign: "center" }}>{`Are you sure you want to delete ${shop?.name}?`}</h4>
        <button onClick={handleDelete}>Yes</button>
        <button onClick={onHide}>No</button>
      </div> */}
    </Modal>
  );
}

export default DeleteShopOwner;
