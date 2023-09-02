import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <NavBar />
      <main className="d-flex flex-column justify-content-center align-items-center px-2 py-5 gap-1 flex-fill">
        <h1 className="text-center fw-bold" style={{ fontSize: "50pt" }}>
          Oops!
        </h1>
        <p className="text-center fw-semibold" style={{ fontSize: "14pt" }}>
          404 - PAGE NOT FOUND
        </p>
        <p className="text-center my-2" style={{ maxWidth: "400px" }}>
          The page you are looking for might have been removed had its name changed or is temporarily unavailable.
        </p>
        <button className="btn-1 rounded-pill px-5 py-2 my-3 fw-semibold fs-5" onClick={() => navigate("/")}>
          GO TO HOMEPAGE
        </button>
      </main>
    </div>
  );
}

export default NotFound;
