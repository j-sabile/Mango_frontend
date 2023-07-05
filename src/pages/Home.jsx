import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

function Home() {
  return (
    <>
      <NavBar />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          <div>
            <h5>Fresh Mangoes</h5>
            <button>Order Now</button>
          </div>
          <img src="" alt="mango" />
        </div>
      </div>
    </>
  );
}

export default Home;
