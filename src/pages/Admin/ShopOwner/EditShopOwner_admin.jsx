import { useState, useEffect } from "react";

function EditShopOwner({ shopId }) {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/shops/${shopId}`, { credentials: "include" })
      .then((res) => res.status === 200 && res.json())
      .then((res) => setShop(res.request));
  }, []);

  useEffect(() => console.log(shop), [shop]);

  return (
    <>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <br />
      <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <input type="text" placeholder="Address" required value={address} onChange={(e) => setAddress(e.target.value)} />
      <br />
      <input type="text" placeholder="Phone Number" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      <br />

      <div style={{ position: "relative", width: "100%" }}>
        <div id="map" style={{ height: "400px", width: "100%", position: "relative" }} />
        <img
          src="https://www.nicepng.com/png/detail/295-2955914_red-marker-on-map.png"
          alt="Marker"
          style={{ position: "absolute", top: "calc(50% - 20px)", left: "calc(50% - 12px)", height: "20px" }}
        />
      </div>
      <button onClick={handleAdd}>Add</button>
    </>
  );
}

export default EditShopOwner;
