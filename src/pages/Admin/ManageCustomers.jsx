import { useState, useEffect } from "react";

function ManageCustomers() {
  const [customers, setCustomers] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => console.log("customers:", customers), [customers]);

  const loadCustomers = async () => {
    setCustomers(null);
    const res = await fetch(`${import.meta.env.VITE_API}/customers`, { method: "GET", credentials: "include" });
    const data = await res.json();
    if (res.ok) setCustomers(data.request);
  };

  return (
    <div className="d-flex flex-column gap-3 flex-fill">
      {/* HEADER */}
      <div className="d-flex justify-content-between">
        <h3>Customers</h3>
        <div className="d-flex gap-3">
          <button className="btn-cncl rounded-3 px-3 py-1 fw-semibold" onClick={loadCustomers}>
            Reload
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="d-flex flex-column gap-2 p-1 p-sm-3 flex-fill" style={{ overflowY: "auto", height: "1px" }}>
        {customers?.map((customer, index) => (
          <div className="d-flex flex-row justify-content-between align-items-center p-3 py-sm-4 px-sm-5" style={{ borderRadius: "1rem", backgroundColor: "#FFFFFF", boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }} key={index}>
            <div className="fw-semibold">{`${customer.first_name} ${customer.last_name}`}</div>
            <div className="d-flex gap-2">
              <button className="btn-cncl rounded-2 px-3 py-1">Edit</button>
              <button className="btn-dngr rounded-2 px-3 py-1">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageCustomers;
