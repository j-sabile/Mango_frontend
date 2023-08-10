import { useState, useEffect } from "react";
import NavBar from "../../../components/NavBar";
import { Loader } from "@googlemaps/js-api-loader";

function AddShopOwner() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dates, setDates] = useState([]);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [date, setDate] = useState("");
  const [selectedDays, setSelectedDays] = useState(new Set());
  const [map, setMap] = useState(null);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const loader = new Loader({ apiKey: import.meta.env.VITE_MAPS_API, version: "weekly" });
    loader.importLibrary("maps").then(() => {
      const map = new window.google.maps.Map(document.getElementById("map"), { center: { lat: 15.2082, lng: 120.6088 }, zoom: 15 });
      setMap(map);
    });
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API}/shops`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
        address: address,
        pinAddressLat: map.getCenter().lat(),
        pinAddressLng: map.getCenter().lng(),
        phoneNumber: phoneNumber,
        sched: [{}, {}, {}, {}, {}, {}, {}],
        // sched: sched,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  // const handleCheckboxChange = (day) => {
  //   const newSelectedDays = new Set(selectedDays);
  //   newSelectedDays.has(day) ? newSelectedDays.delete(day) : newSelectedDays.add(day);
  //   setSelectedDays(newSelectedDays);
  // };

  useEffect(() => console.log("selectedDays :", selectedDays), [selectedDays]);
  useEffect(() => console.log("openTime :", openTime), [openTime]);
  useEffect(() => console.log("closeTime :", closeTime), [closeTime]);
  useEffect(() => console.log("dates :", dates), [dates]);

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
      {/* <label htmlFor="sched">Select a sched:</label>
      <select id="sched" value={sched} onChange={(e) => setSched(e.target.value)}>
        <option value="none">None</option>
        <option value="day">Per Day</option>
        <option value="date">Per Date</option>
      </select> */}

      {/* {sched === "day" && (
        <div>
          <label htmlFor="openTime">Open:</label>
          <input type="time" id="openTime" onChange={(e) => setOpenTime(e.target.value)} value={openTime} />
          <label htmlFor="closeTime">Close:</label>
          <input type="time" id="closeTime" onChange={(e) => setCloseTime(e.target.value)} value={closeTime} />
          <br />
          {days.map((day, index) => (
            <div key={index}>
              <input type="checkbox" id={day} onChange={() => handleCheckboxChange(day)} checked={selectedDays.has(day)} />
              <label htmlFor={day}>{day}</label>
            </div>
          ))}
        </div>
      )} */}

      {/* {sched === "date" && (
        <div>
          <h6>Dates</h6>
          {showAddDate && (
            <div>
              <label htmlFor="date">Date:</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <br />
              <label htmlFor="openTime">Open:</label>
              <input type="time" id="openTime" value={openTime} onChange={(e) => setOpenTime(e.target.value)} />
              <br />
              <label htmlFor="closeTime">Close:</label>
              <input type="time" id="closeTime" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} />
            </div>
          )}
          <button onClick={() => (showAddDate ? handleAddDate() : setShowAddDate(true))}>Add</button>

          {dates.map((date, index) => (
            <div key={index}>{"Open : " + date.open + "   Close: " + date.close}</div>
          ))}
        </div>
      )} */}

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

export default AddShopOwner;
