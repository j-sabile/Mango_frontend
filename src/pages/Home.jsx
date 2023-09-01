import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function Home() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  const handleOrderNow = () => {
    console.log(userType);
    if (userType === "Customer") navigate("/create-order");
    else if (userType === null) navigate("/sign-in");
  };

  return (
    <>
      <NavBar />
      <section className="d-flex justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column justify-content-center align-items-start">
            <p style={{ fontSize: "36pt", fontWeight: "600", color: "#000814" }}>Fresh Mangoes</p>
            <button className="btn" onClick={handleOrderNow} style={{ backgroundColor: "#FFC300", color: "#F3F3F3", fontWeight: "500", padding: "0.5rem 2rem", fontSize: "16pt" }}>
              Order Now
            </button>
          </div>
          <div className="">
            <img src="https://img.freepik.com/free-vector/yellow-mango-with-leaf-cartoon-sticker_1308-92449.jpg?w=2000" height="350" alt="mango" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
