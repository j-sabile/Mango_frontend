import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>Mango Graham Float</div>
      <Link to="/sign-in">
        <button>Sign In</button>
      </Link>
    </div>
  );
}
export default NavBar;
