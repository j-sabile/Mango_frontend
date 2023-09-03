import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";

function MyAccountCustomer() {
  const [myAccount, setMyAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/my-account`, { method: "GET", credentials: "include" });
      if (res.ok) setMyAccount((await res.json()).request);
    };
    init();
  }, []);

  if (!myAccount) return;

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <NavBar />
      <section className="d-flex justify-content-center px-2 py-3 p-sm-5 flex-fill" style={{ background: "radial-gradient(circle, rgba(252,250,238,1) 35%, rgba(240,229,168,1) 100%)" }}>
        <div className="d-flex flex-column" style={{ width: "700px" }}>
          {/* HEADER */}
          <h1 className="fw-normal m-0 mx-4">My Account</h1>
          <hr className="my-2" />

          {/* ACCOUNT INFO */}
          <div className="d-flex flex-column gap-3 p-2 p-sm-4">
            <div className="card rounded-4 p-4 px-sm-5 border-0" style={{ boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }}>
              {/* BASIC INFO */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "5px" }}>
                <div className="fw-semibold me-2">Name:</div>
                <div>{`${myAccount?.first_name} ${myAccount.last_name}`}</div>
                <div className="fw-semibold me-2">Email:</div>
                <div style={{ wordWrap: "break-word", maxWidth: "100%" }}>{myAccount?.email}</div>
                <div className="fw-semibold me-2">Phone Number:</div>
                <div>{myAccount?.phone_number}</div>
                <div className="fw-semibold me-2">Address:</div>
                <div>{myAccount?.address}</div>
                <div className="fw-semibold me-2">Pin Address:</div>
                <div>{myAccount?.pin_address}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MyAccountCustomer;
