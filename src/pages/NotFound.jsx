import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <NavBar />
      <main className="d-flex flex-column justify-content-center align-items-center px-2 gap-1" style={{ height: "100%" }}>
        <h1 className="text-center fw-bold" style={{ fontSize: "50pt" }}>
          Oops!
        </h1>
        <p className="text-center fw-semibold" style={{ fontSize: "14pt" }}>
          404 - PAGE NOT FOUND
        </p>
        <p className="text-center my-2" style={{ maxWidth: "400px" }}>
          The page you are looking for might have been removed had its name changed or is temporarily unavailable.
        </p>
        <button className="btn rounded-pill px-5 py-2 my-3" style={{ backgroundColor: "#FFD60A", color: "#001D3D", fontWeight: "600", fontSize: "14pt", border: "0", letterSpacing: "1px" }} onClick={() => navigate("/")}>
          GO TO HOMEPAGE
          {/* Go To Homepage */}
        </button>
      </main>
    </div>
  );
}

export default NotFound;
