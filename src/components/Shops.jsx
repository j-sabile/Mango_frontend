import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Shops() {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/shops`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((res) => setShops(res.request));
  }, []);

  useEffect(() => console.log("shops:", shops), [shops]);

  return (
    <>
      <h4>Shops</h4>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        {shops?.map((shop, index) => (
          <div key={index} style={{ border: "1px solid black", padding: "1rem", width: "25rem" }}>
            <h6>{shop.name}</h6>
            <p>{shop.pin_address}</p>
            <button onClick={() => navigate("/chat")}>Chat</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Shops;
