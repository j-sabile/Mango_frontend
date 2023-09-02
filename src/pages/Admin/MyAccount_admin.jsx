import { useState } from "react";
import NavBar from "../../components/NavBar";
import ManageCustomers from "./ManageCustomers";
import ManageShops from "./ManageShops";

function MyAccountAdmin() {
  const [selectedNav, setSelectedNav] = useState("Shops");

  const navs = [
    { name: "MANAGE SHOPS", value: "Shops" },
    { name: "MANAGE CUSTOMERS", value: "Customers" },
  ];

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <NavBar />
      <section className="d-flex justify-content-center px-3 py-4 p-sm-5 flex-fill" style={{ background: "radial-gradient(circle, rgba(252,250,238,1) 35%, rgba(240,229,168,1) 100%)" }}>
        <div className="d-flex flex-column gap-4" style={{ width: "800px" }}>
          {/* NAVIGATION TILES */}
          <div className="d-flex">
            {navs.map((nav, index) => (
              <div
                className="text-center fs-5 fw-semibold h-100 py-2"
                style={{ letterSpacing: "0.3px", flex: 1, cursor: "pointer", borderBottom: selectedNav === nav.value ? "2px solid grey" : "" }}
                onClick={() => setSelectedNav(nav.value)}
                key={index}>
                {nav.name}
              </div>
            ))}
          </div>

          {/* NAVIGATION BODY */}
          <div className="d-flex flex-column flex-fill px-0 px-sm-5">
            {selectedNav === "Shops" && <ManageShops />}
            {selectedNav === "Customers" && <ManageCustomers />}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MyAccountAdmin;
