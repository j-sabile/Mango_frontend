import { useState } from "react";
import { useEffect } from "react";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"];

function ViewShopOwner({ shopId }) {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/shops/${shopId}`, { method: "GET", credentials: "include" })
      .then((res) => res.status === 200 && res.json())
      .then((res) => setShop(res.request));
  }, []);

  useEffect(() => console.log(shop), [shop]);

  const convertToPhTime = (isoDate) => {
    return new Date(isoDate).toLocaleTimeString();
  };

  const showSched = (sched) => {
    if (!sched.open) return "No Schedule";
    else return convertToPhTime(sched.open) + " - " + convertToPhTime(sched.close);
  };

  return (
    <div style={{ padding: "2rem" }}>
      {shop ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h5>{shop.name}</h5>
          <br />
          <ul style={{ listStyle: "none" }}>
            <li>{"Email: " + shop.email}</li>
            <li>{"Address: " + shop.address}</li>
            <li>{"Pin Address: " + shop.pin_address}</li>
            <li>{"Phone Number: " + shop.phone_number}</li>
            <li>{"Force Open: " + shop.force_open}</li>
          </ul>
          <h6>Stock</h6>
          <ul style={{ listStyle: "none" }}>
            <li>{"Small: " + shop.stock_small}</li>
            <li>{"Medium: " + shop.stock_medium}</li>
            <li>{"Large: " + shop.stock_large}</li>
            <li>{"Nata: " + shop.stock_nata}</li>
            <li>{"Pearl: " + shop.stock_pearl}</li>
            <li>{"Fruit Jelly: " + shop.stock_fruitjelly}</li>
          </ul>
          <h6>Schedule</h6>
          <ul style={{ listStyle: "none" }}>
            {shop.sched.map((day, index) => (
              <li key={index}>{days[index] + ": " + showSched(day)}</li>
            ))}
          </ul>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default ViewShopOwner;
